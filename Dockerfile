# ResumeMatch backend — FastAPI + Playwright (PDF/report/card rendering) +
# fastembed (on-device requirement matching). Built as a container because
# Playwright needs a real Chromium and its system libraries; that rules out
# serverless hosts like Vercel functions.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HUB_DISABLE_TELEMETRY=1 \
    # ride out flaky build-network hiccups instead of failing the whole deploy
    PIP_RETRIES=10 \
    PIP_DEFAULT_TIMEOUT=60 \
    # keep ONNX single-threaded so memory stays predictable on small instances
    OMP_NUM_THREADS=1

WORKDIR /app

# Build networks often resolve pypi.org to IPv6 while having no IPv6 route;
# glibc then fails immediately with "[Errno 101] Network is unreachable" and pip
# never reaches PyPI. Preferring IPv4 sidesteps it, and is harmless where IPv6
# does work.
RUN printf 'precedence ::ffff:0:0/96  100\n' >> /etc/gai.conf

# Install Python deps first (cached unless the requirement files change), then
# let Playwright pull the matching Chromium build plus its apt dependencies.
# Kept as separate steps so a failure points at the exact stage.
COPY backend/requirements.txt backend/requirements.txt
COPY requirements-deploy.txt requirements-deploy.txt
RUN pip install -r requirements-deploy.txt
RUN python -m playwright install --with-deps chromium

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
