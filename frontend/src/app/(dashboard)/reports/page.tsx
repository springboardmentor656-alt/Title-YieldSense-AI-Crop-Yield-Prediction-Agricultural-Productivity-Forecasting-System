/**
 * YieldSense AI — Reports Page (Placeholder)
 */

import React from "react";
import { FileText } from "lucide-react";
import PlaceholderPage from "@/components/shared/PlaceholderPage";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports & Analytics"
      description="Generate detailed reports on crop performance, yield trends, seasonal comparisons, and financial projections for your farms."
      icon={<FileText className="h-10 w-10" />}
      milestone="Milestone 3"
    />
  );
}
