# -------------------------------------------------------------
# SHUBHANU Python FastAPI Avatar Service Dockerfile
# PyTorch + Diffusers Alpine compatible slim debian build
# -------------------------------------------------------------

FROM python:3.11-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependency packages (including torch CPU/CUDA libraries)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source application
COPY app ./app/

EXPOSE 8003

ENV PORT=8003

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003"]
