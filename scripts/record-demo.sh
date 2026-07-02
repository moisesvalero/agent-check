#!/usr/bin/env bash
# Demo para asciinema: escaneo y dry-run sobre fixture con conflictos.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="$ROOT/packages/cli/dist/cli.js"
FIXTURE="$ROOT/packages/cli/tests/fixtures/cursor-claude-conflict"

cd "$ROOT/packages/cli"
pnpm run build >/dev/null 2>&1

clear
echo "\$ cd my-project"
sleep 0.4
echo "\$ npx agentchecker --dry-run -y --local-only"
sleep 0.5

node "$CLI" --dry-run -y --local-only --project-dir "$FIXTURE"
