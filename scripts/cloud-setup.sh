#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the websoot Astro site.
# Installs the Bun toolchain (if missing), project dependencies, and a local
# .env so the dev server and build can run without any secrets.
set -euo pipefail

BUN_DIR="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_DIR/bin:$PATH"

if ! command -v bun >/dev/null 2>&1; then
  echo "bun not found; installing…"
  curl -fsSL https://bun.sh/install | bash
fi

bun --version

bun install --frozen-lockfile

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "Cloud Agent setup complete."
