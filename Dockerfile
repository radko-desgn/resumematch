# ResumeMatch backend — FastAPI + Playwright (PDF/report/card rendering) +
# fastembed (on-device requirement matching). Built as a container because
# Playwright needs a real Chromium and its system libraries; that rules out
# serverless hosts like Vercel functions.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HUB_DISABLE_TELEMETRY=1 \
    # keep ONNX single-threaded so memory stays predictable on small instances
    OMP_NUM_THREADS=1

WORKDIR /app

# Install Python deps first (cached unless the requirement files change), then
# let Playwright pull the matching Chromium build plus its apt dependencies.
COPY backend/requirements.txt backend/requirements.txt
COPY requirements-deploy.txt requirements-deploy.txt
RUN pip install -r requirements-deploy.txt \
 && python -m playwright install --with-deps chromium

# Bake the embedding model into the image so the first live request doesn't
# stall downloading it (and so the container needs no network to match).
RUN python -c "from fastembed import TextEmbedding; TextEmbedding('BAAI/bge-small-en-v1.5')"

# Application code (changes most often -> copied last for better layer caching).
COPY backend/ backend/
COPY resumematch/ resumematch/

# The host injects $PORT (Render, Railway, Fly all do); default for local runs.
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
