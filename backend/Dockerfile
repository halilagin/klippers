# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for building some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    git \
    curl \
    cmake \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Install poetry and add to PATH
ENV POETRY_HOME=/opt/poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry && \
        poetry --version

# Copy poetry files
# COPY pyproject.toml poetry.lock ./
COPY . .
RUN cp .env.docker .env
# Configure poetry to install dependencies globally
RUN poetry config virtualenvs.create false && \
  poetry install --no-interaction --no-ansi

RUN cp -f patches/oscrypto/*.py  /usr/local/lib/python3.11/site-packages/oscrypto/_openssl/

# Expose port 8000
EXPOSE 22081

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "22081", "--reload"] 
