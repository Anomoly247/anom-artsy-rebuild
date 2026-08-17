#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/app"
PORT="${AO_RELEASE_PORT:-4175}"
BASE_URL="http://127.0.0.1:${PORT}"
PID_FILE="${TMPDIR:-/tmp}/ao-release-check.pid"
LOG_FILE="${TMPDIR:-/tmp}/ao-release-check.log"

cleanup() {
  if [[ -f "$PID_FILE" ]]; then
    kill "$(cat "$PID_FILE")" 2>/dev/null || true
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT

cd "$APP_DIR"
echo "[AO] TypeScript check"
pnpm check

echo "[AO] Production build"
pnpm build

echo "[AO] Starting isolated production smoke server on ${PORT}"
PORT="$PORT" HOST=127.0.0.1 nohup pnpm start >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 3

routes=(
  "/"
  "/anoms-corner"
  "/moonberry-farm"
  "/archive/moonberry-morning"
  "/district-b-arcade"
  "/games"
  "/admin"
)

for route in "${routes[@]}"; do
  status="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}${route}")"
  if [[ "$status" != "200" ]]; then
    echo "[AO] FAIL ${route} returned ${status}"
    exit 1
  fi
  echo "[AO] PASS ${route} ${status}"
done

echo "[AO] Release validation passed"
