#!/usr/bin/env bash
# Pour lancer le front et le back ensemble.

trap 'kill 0' EXIT

(cd backend && uv run fastapi dev src/backend/main.py --host 0.0.0.0) &
(cd frontend && npm run dev) &

wait
