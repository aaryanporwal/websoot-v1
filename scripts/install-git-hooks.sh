#!/usr/bin/env bash
# Point git at repo hooks and copy them into .git/hooks so Cursor Cloud's
# dispatcher still runs them after it overrides core.hooksPath.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git config core.hooksPath .githooks
chmod +x .githooks/commit-msg scripts/ensure-git-identity.sh scripts/install-git-hooks.sh

if [ -d .git/hooks ]; then
  cp .githooks/commit-msg .git/hooks/commit-msg
  chmod +x .git/hooks/commit-msg
fi

"$ROOT/scripts/ensure-git-identity.sh"
