#!/usr/bin/env bash
set -euo pipefail

echo "==> Start deploy"
echo "==> Host: $(hostname)"
echo "==> User: $(whoami)"
echo "==> Service: ${COMPOSE_SERVICE}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is not available"
  exit 1
fi

if [ ! -d "${REMOTE_APP_DIR}" ]; then
  echo "Remote app dir not found: ${REMOTE_APP_DIR}"
  exit 1
fi

echo "==> Login to GHCR"
echo "${GHCR_PULL_TOKEN}" | docker login "${REGISTRY}" -u "${GHCR_PULL_USERNAME}" --password-stdin

cd "${REMOTE_APP_DIR}"

echo "==> Pull image for service: ${COMPOSE_SERVICE}"
docker compose pull "${COMPOSE_SERVICE}"

echo "==> Restart service: ${COMPOSE_SERVICE}"
docker compose up -d "${COMPOSE_SERVICE}"

echo "==> Current containers"
docker compose ps

echo "==> Cleanup old images"
docker image prune -f

echo "==> Deploy completed"
