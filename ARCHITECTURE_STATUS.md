# YieldSense AI — Architecture Status

Honest gap map against the target 9-component architecture. Status as of 2026-07-20. Everything marked EXISTS is real, wired, and was verified to boot/typecheck — nothing here is claimed before it's actually in the repo.

## 1. User Roles & Access — EXISTS
5 roles seeded: Farmer, Agriculture Department, Agri Consultant, Researcher, Administrator (`backend/app/database/seed_roles.py`). RBAC via `require_roles()` (`backend/app/auth/permissions.py`), JWT auth (`backend/app/auth/jwt.py`, `oauth2.py`), admin user management (`backend/app/api/users.py`).

## 2. Web/Mobile Application Layer — PARTIAL
All 8 core modules now have real pages calling real APIs: Home Dashboard, Farm Management, Yield Forecast (`predictions`), Weather Analysis, Soil Analysis, Reports & Analytics (`reports`, `analytics`), Notifications, Support/Help.
- **Mobile**: NOT STARTED — web-only Next.js, no React Native/mobile shell.

## 3. External Data & Services Integration — PARTIAL
- Weather API: real (OpenWeather).
- Agriculture datasets: real (CSV, feeds the trained model).
- Satellite Data: real client (`backend/app/providers/satellite_provider.py`, NASA POWER API, keyless) — reachable via `/integrations/satellite` demo endpoint, not yet surfaced in any farm-facing UI.
- Government Open Data: client built (`gov_data_provider.py`, data.gov.in) but **gated behind an unconfigured `DATA_GOV_IN_RESOURCE_ID` placeholder** — will raise until a real resource ID is looked up and set in `.env`. Do not claim this is "live" until that's done.
- Soil Data Sources: internal only (manually entered soil reports), no external soil-testing API integration.

## 4. API Gateway — PARTIAL
FastAPI itself is the gateway (no separate gateway service, appropriate at this scale — flag this explicitly if asked "where's the gateway"). Auth (JWT), routing, RBAC, request logging (`middleware/request_logger.py`) all exist. Rate limiting now exists (`middleware/rate_limiter.py`, in-memory per-IP sliding window) — **caveat: per-process state, won't hold across multiple replicas without Redis**, noted in the file.

## 5. AI & Data Processing Pipeline — EXISTS (all 7 stages)
1. Data Collection — farm/crop/weather/soil models + repos.
2. Preprocessing — real pipeline, `backend/app/preprocessing/*`.
3. Weather Analysis — weather service + analytics weather-impact bucketing.
4. Soil Analysis — pH/nutrient/fertility scoring, `soil_service.py`.
5. Yield Prediction Model — real trained XGBoost pipeline, R²=0.93 (`backend/models/crop_yield_model.pkl`).
6. Prediction Outputs — predicted yield, confidence, **risk_level, season_comparison, trend_forecast** (added this pass).
7. Recommendations — crop suggestion, fertilizer advice, irrigation plan, pest tips, best practices. **Explicitly rule-based/deterministic, not ML** — documented as such in `recommendation_service.py` so it's never misrepresented as a model output.

## 6. Agricultural Analytics & Insights — EXISTS
Yield trend, farm comparison, weather impact analysis, risk/anomaly detection (z-score based), CSV export, prediction-accuracy tracking (MAPE, requires actual-yield entry) — `backend/app/services/analytics_service.py` + `/dashboard/analytics` and `/dashboard/reports` frontend pages.

## 7. Data & Storage Layer — PARTIAL
- PostgreSQL: exists, all models registered, verified live table creation.
- Scheduled backup: script exists (`backend/scripts/backup_db.sh`, real `pg_dump`) but **not wired to an actual scheduler** (no cron/Task Scheduler entry) — running it is a manual step today.
- Object storage for weather/soil, data warehouse for analytics: NOT STARTED — these require a real cloud storage account (S3/GCS) and a warehouse (BigQuery/Redshift/Snowflake) to be genuinely provisioned, not something a local repo can fake convincingly.

## 8. Infrastructure Layer — PARTIAL
- Containerization: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` (postgres + backend + frontend).
- CI/CD: `.github/workflows/ci.yml` (backend pytest against a real postgres service container, frontend lint+build).
- Load balancer: `nginx/nginx.conf` written as a reverse-proxy stand-in, **not wired into `docker-compose.yml`** (documented there as a 4th-service snippet to add if you want to demo it).
- Cloud platform hosting, actual orchestration (Kubernetes), WAF/managed firewall, hosted monitoring dashboards (Grafana/Datadog/etc.), real disaster-recovery: **NOT STARTED, and honestly can't be "implemented" as local repo code** — these need a real cloud account and provisioning. Say this plainly if asked in an interview rather than pointing at a config file that doesn't actually run anywhere.

## 9. Integrations — PARTIAL
- AI model serving: exists, but as **in-process model loading** (`joblib` + `lru_cache` inside the FastAPI process), not a separate model-serving layer (e.g. Triton/TorchServe/SageMaker endpoint) — accurate to call this "model serving" only in the narrow sense.
- GIS/mapping: real geocode/reverse-geocode client (`gis_provider.py`, OpenStreetMap Nominatim) reachable via `/integrations/gis/*` — **no map UI** yet (the frontend already depends on `leaflet`/`react-leaflet` but no component uses them).
- Email: real SMTP client (`email_provider.py`), requires `SMTP_*` env vars to activate — not yet triggered automatically from any event (e.g. new notification).
- SMS: real Twilio REST client (`sms_provider.py`), requires `TWILIO_*` env vars — same, not auto-triggered.
- Push notifications: NOT STARTED (no FCM/web-push).
- Mobile app support: NOT STARTED (see #2).

## Fixed this pass (post-review)
- Sidebar nav didn't link to Predictions/Soil Analysis for Farmer/Administrator, or Predictions for Agri Consultant — pages existed but were unreachable. Fixed.
- `farm_service.py` checked `role=="Admin"` in 3 places while the seeded role is `"Administrator"` — Administrator effectively had no cross-user farm access (fell through to owner-only branch). Fixed.
- Crop Management had a model but zero API (no way to attach a crop to a farm through the app) and the frontend page was 100% hardcoded mock data with no nav link anywhere. Built real CRUD (`crops` API + repo/service, `crop.service.ts`/`useCrop.ts`/real page), added nav link for Farmer/Agri Consultant/Administrator.

## Known gaps carried forward
- **No automated tests** for any of the new modules built this pass (recommendations, analytics, notifications, integrations, prediction enrichment) or the earlier milestone-2 modules (predictions, soil, users, ML pipeline). This is the single biggest thing standing between "it works when I click it" and "it's provably correct."
- `backend/tests/test_health,py` has a pre-existing filename typo (comma instead of period) — pytest silently never collects it.
- Notification delivery (email/SMS/push) is not wired to actual application events yet — in-app notifications work end-to-end, external delivery channels are built but idle.
