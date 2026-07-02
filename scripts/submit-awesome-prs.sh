#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# --- awesome-cursorrules ---
# Contributor PRs cannot add external README listings (readme/no-contributor-external-listing).
# Submit a rule file; maintainers curate README entries.
rm -rf /tmp/awesome-cursorrules
gh repo fork PatrickJS/awesome-cursorrules --clone=true --remote=false /tmp/awesome-cursorrules
cd /tmp/awesome-cursorrules
git checkout -b add-agentchecker
cp "$REPO_ROOT/scripts/awesome-cursorrules-agent-instruction-alignment.mdc" \
  rules/agent-instruction-alignment-cursorrules-prompt-file.mdc
git add rules/agent-instruction-alignment-cursorrules-prompt-file.mdc
git commit -m "docs: add agent instruction alignment rule for agentchecker"
git push -u origin add-agentchecker
gh pr create --repo PatrickJS/awesome-cursorrules \
  --title "docs: add agent instruction alignment rule" \
  --body "Adds a Cursor rule for keeping agent instruction files aligned across AGENTS.md, CLAUDE.md, Cursor rules, and Copilot instructions. Related: [agentchecker](https://github.com/moisesvalero/agentchecker)."

echo "PR cursorrules: $(gh pr list --repo PatrickJS/awesome-cursorrules --head moisesvalero:add-agentchecker --json url -q '.[0].url')"

# --- awesome-ai-coding-tools ---
rm -rf /tmp/awesome-ai-coding-tools
gh repo fork ai-for-developers/awesome-ai-coding-tools --clone=true --remote=false /tmp/awesome-ai-coding-tools
cd /tmp/awesome-ai-coding-tools
git checkout -b add-agentchecker
python3 - <<'PY'
from pathlib import Path
readme = Path("README.md").read_text()
line = "- **[agentchecker](https://github.com/moisesvalero/agentchecker)** – CLI that scans `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Copilot instructions for contradictions and auto-fixes them. `npx agentchecker`\n"
needle = "## CLI Tools\n"
if "agentchecker" not in readme and needle in readme:
    readme = readme.replace(needle, needle + "\n" + line, 1)
    Path("README.md").write_text(readme)
PY
git add README.md
git commit -m "docs: add agentchecker to CLI tools"
git push -u origin add-agentchecker
gh pr create --repo ai-for-developers/awesome-ai-coding-tools \
  --title "docs: add agentchecker CLI" \
  --body "Adds [agentchecker](https://github.com/moisesvalero/agentchecker) under CLI Tools."

echo "PR coding-tools: $(gh pr list --repo ai-for-developers/awesome-ai-coding-tools --head moisesvalero:add-agentchecker --json url -q '.[0].url')"

# --- awesome-ai-agents (e2b) ---
rm -rf /tmp/awesome-ai-agents
gh repo fork e2b-dev/awesome-ai-agents --clone=true --remote=false /tmp/awesome-ai-agents
cd /tmp/awesome-ai-agents
git checkout -b add-agentchecker
python3 - <<'PY'
from pathlib import Path
block = """
## [agentchecker](https://github.com/moisesvalero/agentchecker)

<img src="https://github.com/moisesvalero/agentchecker/raw/main/demo.gif" align="right" width="150"/>

### Category

Coding, DevTools

### Description

- CLI (`npx agentchecker`) that scans AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions, and other agent config files for contradictions (package manager, linter, formatter, etc.) and fixes project-local files interactively or in CI with `--check-only`.

### Links

- [GitHub](https://github.com/moisesvalero/agentchecker)
- [npm](https://www.npmjs.com/package/agentchecker)

"""
readme = Path("README.md").read_text()
needle = "## [Agent4Rec]"
if "agentchecker" not in readme and needle in readme:
    readme = readme.replace(needle, block + needle, 1)
    Path("README.md").write_text(readme)
PY
git add README.md
git commit -m "docs: add agentchecker"
git push -u origin add-agentchecker
gh pr create --repo e2b-dev/awesome-ai-agents \
  --title "docs: add agentchecker CLI" \
  --body "Adds [agentchecker](https://github.com/moisesvalero/agentchecker) — CLI to detect and fix contradictions between AI agent instruction files."

echo "PR ai-agents: $(gh pr list --repo e2b-dev/awesome-ai-agents --head moisesvalero:add-agentchecker --json url -q '.[0].url')"
