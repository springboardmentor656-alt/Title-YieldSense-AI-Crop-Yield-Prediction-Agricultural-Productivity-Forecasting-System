# YieldSense AI backend - FastAPI + uvicorn
#
# Single-stage build: pip wheels are the only "build" step this project
# needs (no C-extension compiling beyond what manylinux wheels already
# cover for numpy/pandas/scikit-learn/xgboost/psycopg2-binary), so a
# multi-stage split would add complexity without a real image-size win.

FROM python:3.11-slim

# Prevent .pyc files and force stdout/stderr to be unbuffered so logs
# show up immediately in `docker logs`.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps needed to build psycopg2-binary / scientific wheels on slim.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first so this layer is cached unless requirements change.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application code.
COPY app/ ./app/

# Trained model artifacts loaded at runtime by app/services/prediction_service.py
# (BASE_DIR / "models" / "crop_yield_model.pkl"). Optional at build time -
# if the directory doesn't exist yet, prediction endpoints will 500 until
# a model is trained/copied in; everything else still works.
COPY models/ ./models/

# Run as non-root.
RUN useradd --create-home --uid 1000 appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# $PORT defaults to 8000; shell form so the env var is expanded at runtime.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
