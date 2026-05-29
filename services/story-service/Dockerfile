# -------------------------------------------------------------
# SHUBHANU Python FastAPI Story Service Dockerfile
# Production-ready slim debian build
# -------------------------------------------------------------

FROM python:3.11-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependency packages
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source application
COPY app ./app/

EXPOSE 8000

ENV PORT=8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
