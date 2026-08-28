#!/usr/bin/env bash
# Reclaim commit authorship when this clone is using Cursor Cloud's default identity.
# Local repo config overrides ~/.gitconfig for this clone only.
set -euo pipefail

CURSOR_EMAIL="cursoragent@cursor.com"
CURSOR_NAME="Cursor Agent"
AUTHOR_NAME="Aaryan Porwal"
AUTHOR_EMAIL="aaryanporwal2233@gmail.com"

email="$(git config --get user.email || true)"
name="$(git config --get user.name || true)"

if [ "$email" = "$CURSOR_EMAIL" ] || [ "$name" = "$CURSOR_NAME" ]; then
  git config --local user.name "$AUTHOR_NAME"
  git config --local user.email "$AUTHOR_EMAIL"
fi
