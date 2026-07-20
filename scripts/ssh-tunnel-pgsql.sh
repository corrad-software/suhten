#!/usr/bin/env bash
# SSH tunnel: localhost:5433 -> Postgres on private host via bastion
# Keep this terminal open while developing against PostgreSQL.
# Usage (Git Bash / MINGW64):
#   ./scripts/ssh-tunnel-pgsql.sh
#   or:  bash scripts/ssh-tunnel-pgsql.sh

set -euo pipefail

KEY="${HOME}/.ssh/bastion-key-st.pem"
SRC_KEY="/c/ST/bastion-key.pem"

if [[ ! -f "${KEY}" ]]; then
  echo "Copying bastion key with restricted permissions..."
  mkdir -p "${HOME}/.ssh"
  if [[ -f "${SRC_KEY}" ]]; then
    cp -f "${SRC_KEY}" "${KEY}"
  elif [[ -f "C:/ST/bastion-key.pem" ]]; then
    cp -f "C:/ST/bastion-key.pem" "${KEY}"
  else
    echo "ERROR: Bastion key not found at ${SRC_KEY}" >&2
    exit 1
  fi
  chmod 600 "${KEY}"
fi

echo "Forwarding 127.0.0.1:5433 to ip-10-103-32-100.ap-southeast-5.compute.internal:5432"
echo "via bastion 43.217.107.131 ..."
exec ssh -i "${KEY}" \
  -o StrictHostKeyChecking=accept-new \
  -o ServerAliveInterval=60 \
  -N \
  -L 5433:ip-10-103-32-100.ap-southeast-5.compute.internal:5432 \
  ec2-user@43.217.107.131
