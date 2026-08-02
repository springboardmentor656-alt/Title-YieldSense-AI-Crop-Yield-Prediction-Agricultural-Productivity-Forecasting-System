"""PDF performance report generation for YieldSense AI.

Composes a single downloadable PDF from a farm's profile, its latest
rule-based recommendations, environmental risk assessment and
prediction history — reusing RecommendationService and
PredictionHistoryRepository rather than recomputing any of it, so the
PDF always matches what the dashboard shows.
"""

import io
from typing import Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.repositories.prediction_history_repository import (
    PredictionHistoryRepository,
)
from app.services.farm_service import FarmService
from app.services.recommendation_service import RecommendationService

RISK_ROW_COLORS = {
    "High": colors.HexColor("#fee2e2"),
    "Medium": colors.HexColor("#fef9c3"),
    "Low": colors.HexColor("#dcfce7"),
}

PREDICTION_HISTORY_LIMIT = 15


class ReportService:
    """Builds the farm performance summary PDF."""

    def __init__(self, db: Session):
        self.db = db
        self.farm_service = FarmService(db)
        self.recommendation_service = RecommendationService(db)
        self.history_repo = PredictionHistoryRepository(db)

    def generate_pdf(self, farm_id: int, token) -> bytes:
        farm = self.farm_service.get_farm(farm_id, token)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            topMargin=2 * cm,
            bottomMargin=2 * cm,
        )
        styles = getSampleStyleSheet()
        story = []

        crop_name = (
            max(farm.crops, key=lambda crop: crop.id).crop_name
            if farm.crops else "N/A"
        )

        story.append(Paragraph("YieldSense AI — Farm Performance Report", styles["Title"]))
        story.append(Spacer(1, 0.5 * cm))
        story.append(Paragraph(
            f"<b>{farm.farm_name}</b> &nbsp;|&nbsp; Area: {farm.area} ha &nbsp;|&nbsp; "
            f"Current crop: {crop_name} &nbsp;|&nbsp; "
            f"Location: {farm.latitude}, {farm.longitude}",
            styles["Normal"],
        ))
        story.append(Spacer(1, 1 * cm))

        self._add_risk_section(story, styles, farm_id, token)
        self._add_recommendation_section(story, styles, farm_id, token)
        self._add_history_section(story, styles, farm_id)

        doc.build(story)
        return buffer.getvalue()

    def _add_risk_section(self, story, styles, farm_id: int, token) -> None:
        story.append(Paragraph("Environmental Risk Assessment", styles["Heading2"]))

        try:
            risk = self.recommendation_service.assess_risk(farm_id, token)
        except ResourceNotFoundException:
            story.append(Paragraph("No weather record on file for this farm.", styles["Normal"]))
            story.append(Spacer(1, 0.5 * cm))
            return

        story.append(Paragraph(
            f"Overall risk level: <b>{risk['overall_risk_level']}</b>", styles["Normal"]
        ))
        story.append(Spacer(1, 0.3 * cm))

        if not risk["risks"]:
            story.append(Paragraph("No environmental threats currently flagged.", styles["Normal"]))
        else:
            rows = [["Type", "Severity", "Advice"]]
            row_colors = [colors.HexColor("#166534")]
            for entry in risk["risks"]:
                rows.append([
                    entry["type"],
                    entry["severity"],
                    Paragraph(entry["advice"], styles["Normal"]),
                ])
                row_colors.append(RISK_ROW_COLORS.get(entry["severity"], colors.white))

            table = Table(rows, colWidths=[3.5 * cm, 2.5 * cm, 9 * cm])
            style_commands = [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#166534")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
            for i, bg in enumerate(row_colors[1:], start=1):
                style_commands.append(("BACKGROUND", (0, i), (-1, i), bg))
            table.setStyle(TableStyle(style_commands))
            story.append(table)

        story.append(Spacer(1, 1 * cm))

    def _add_recommendation_section(self, story, styles, farm_id: int, token) -> None:
        story.append(Paragraph("Recommendations", styles["Heading2"]))

        try:
            rec = self.recommendation_service.generate(farm_id, token)
        except ResourceNotFoundException:
            story.append(Paragraph("No soil report on file for this farm.", styles["Normal"]))
            story.append(Spacer(1, 0.5 * cm))
            return

        story.append(Paragraph(
            "<b>Suggested crops:</b> " + (", ".join(rec["crop_suggestions"]) or "None"),
            styles["Normal"],
        ))
        story.append(Spacer(1, 0.2 * cm))
        story.append(Paragraph(f"<b>Fertilizer advice:</b> {rec['fertilizer_advice']}", styles["Normal"]))
        story.append(Spacer(1, 0.2 * cm))
        story.append(Paragraph(f"<b>Irrigation plan:</b> {rec['irrigation_plan']}", styles["Normal"]))
        story.append(Spacer(1, 0.2 * cm))
        for tip in rec["best_practices"]:
            story.append(Paragraph(f"&bull; {tip}", styles["Normal"]))

        story.append(Spacer(1, 1 * cm))

    def _add_history_section(self, story, styles, farm_id: int) -> None:
        story.append(Paragraph("Recent Predictions", styles["Heading2"]))

        history = self.history_repo.get_by_farm(farm_id, limit=PREDICTION_HISTORY_LIMIT)

        if not history:
            story.append(Paragraph("No predictions recorded yet for this farm.", styles["Normal"]))
            return

        rows = [["Date", "Crop", "Predicted (kg/ha)", "Actual (kg/ha)"]]
        for entry in history:
            features = entry.features or {}
            rows.append([
                entry.created_at.strftime("%Y-%m-%d") if entry.created_at else "",
                features.get("crop", "N/A"),
                f"{entry.prediction:.2f}",
                f"{entry.actual_yield:.2f}" if entry.actual_yield is not None else "-",
            ])

        table = Table(rows, colWidths=[3.5 * cm, 4 * cm, 4 * cm, 4 * cm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#166534")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0fdf4")]),
        ]))
        story.append(table)
