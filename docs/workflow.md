# Agricultural Forecasting Workflow

This document traces the programmatic flow of information through YieldSense AI, from user authentication to yield prediction, before implementation (Milestone 1, Task 1).

## Problem Statement

Farmers and agricultural organizations operate under high economic vulnerability due to changing climate dynamics, variable soil qualities, and unpredictable weather events. Traditional farming relies on historical intuition, which fails under extreme climate volatility — leading to resource misallocation (over-fertilization, poor crop choice, water wastage), lower seasonal yield, and food supply insecurity.

## Project Aim

A centralized, web-responsive predictive analytics ecosystem that uses machine learning (tabular & time-series models) to ingest environmental metrics and provide real-time agricultural yield forecasts (kg/ha), alongside proactive climate risk mitigation advice.

## End-to-End Pipeline

1. **User Login** — Frontend captures credentials, backend issues an encrypted JWT authorization token.
2. **Farm Profile Creation** — User creates a farm profile containing geo-coordinates (latitude/longitude) and soil N-P-K readings.
3. **Weather Data Enrichment** — Backend captures the farm's coordinates, issues a request to an external Weather API, and stores historical environmental features.
4. **Dataset Unification** — Soil parameters + historic weather + target crop type are merged into a single feature set.
5. **Preprocessing** — Missing climate variables are imputed, invalid records (e.g. negative rainfall) are dropped, clean data is written to `data/processed/`.
6. **Yield Prediction** — The unified, preprocessed feature row is passed to the trained ML model (XGBoost / RandomForest), producing a yield estimate (kg/ha) and risk assessment.
7. **Recommendations** — A rules/recommendation layer translates model output + input features into farming advice (irrigation timing, fertilizer adjustment, risk flags).
8. **Dashboard Presentation** — Results are rendered per role (Farmer / Analyst / Admin).

## Actors

| Actor | Responsibility |
|---|---|
| Farmer | Registers, creates farm profiles, requests yield predictions, views recommendations |
| Analyst | Reviews model outputs, generates reports, explores raw data |
| Admin | Manages user accounts and roles, monitors system health |
| System (backend) | Authenticates users, orchestrates weather API calls, runs preprocessing, serves ML inference, persists data |

## Data Flow Summary

```
User → Auth (JWT) → Farm Profile (Postgres) → Weather API → Merged Dataset
    → Preprocessing Pipeline → ML Model → Prediction + Recommendations → Dashboard
```
