#!/usr/bin/env bash
# Point git at repo hooks and copy them into .git/hooks so Cursor Cloud's
# dispatcher still runs them after it overrides core.hooksPath.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git config core.hooksPath .githooks
chmod +x scripts/ensure-git-identity.sh scripts/install-git-hooks.sh

if [ -d .githooks ]; then
  chmod +x .githooks/*
fi

if [ -d .git/hooks ]; then
  for hook in .githooks/*; do
    [ -f "$hook" ] || continue
    cp "$hook" ".git/hooks/$(basename "$hook")"
    chmod +x ".git/hooks/$(basename "$hook")"
  done
fi

"$ROOT/scripts/ensure-git-identity.sh"
