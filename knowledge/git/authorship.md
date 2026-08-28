---
type: Playbook
title: Git authorship
description: Keep Cursor Cloud agents from committing as Cursor Agent.
tags: [git, authorship, cursor-cloud]
resource: scripts/ensure-git-identity.sh
---

# Git authorship

Cursor Cloud VMs default to `Cursor Agent <cursoragent@cursor.com>`. The IDE Attribution toggle only controls a `Made with Cursor` trailer on local/CLI commits. There is no Cloud authorship opt-out.

This repo rewrites that identity to `Aaryan Porwal <aaryanporwal2233@gmail.com>` via local git config (`scripts/ensure-git-identity.sh`). `prepare` / `scripts/install-git-hooks.sh` runs it and installs `.githooks/commit-msg` into `.git/hooks` so Cursor's hook dispatcher still calls it.

## Why the old hook was not enough

Cursor sets `core.hooksPath` to its own directory. Its dispatcher runs the original `commit-msg` first (from `.git/hooks`, not `.githooks`), then appends `Co-authored-by`. A repo-only `hooksPath` never ran on Cloud, and stripping trailers cannot beat a hook that runs after yours.

## Agent rules

1. Run `scripts/ensure-git-identity.sh` before the first commit.
2. Do not commit as Cursor Agent.
3. Do not add `Co-authored-by` trailers.
