# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.3.0] - 2026-08-25

### Added

- `--unify` command: intelligently merge all local proprietary rule files into a master `AGENTS.md` and replace them with relative symlinks.
- `--badge` command: output markdown and HTML snippets for the official "AI Rules Aligned" badge.
- Official GitHub Action (`action.yml`) for zero-config CI integration (`uses: moisesvalero/agentchecker@main`).
- `--init` command: initialize a canonical `AGENTS.md` and link all supported AI tools.
- Intelligent negation detection (`isMatchNegated`) across sentences and parenthesized lists to eliminate false positives.
- `language` rule category detection (`spanish` vs `english`).
- Test runner dependency auditing (`vitest` vs `jest`).

### Fixed

- Consolidated multi-replacement line fixes atomically in diff preview and file writing.
- Resolved all dependency vulnerabilities (Vite 8, Vitest 4, SvelteKit, cookie override).
- Fixed peer dependency compatibility with TypeScript 5.9 and SvelteKit.

## [0.2.0] - 2026-06-28

### Added

- `--symlink` flag to link tool-specific rule files to `AGENTS.md`.
- `--audit-deps` flag to check instruction claims against `package.json` dependencies.
- Added support for Antigravity, OpenCode, Windsurf, Cline/Roo, and Aider.

## [0.1.8] - 2026-06-19

### Changed

- License: MIT → PolyForm Noncommercial 1.0.0
- Landing footer: license link and commercial contact (info@moisesvalero.es)

## [0.1.7] - 2026-06-19

### Added

- `--local-only` flag to scan project files without global home configs (CI-safe)
- Monorepo scripts: `lint`, `check`, `build`, `knip`, `agent-check` at root
- GitHub Actions CI workflow (quality + agent-check jobs)
- Husky pre-commit with lint-staged
- `AGENTS.md` for dogfooding in this repository
- `CONTRIBUTING.md`, `SECURITY.md`, `knip.json`

### Fixed

- Unit tests no longer depend on developer global agent config files
- Removed dead code: `preview-fixes.ts`, unused `AGENT_FILE_OWNERS` export

### Changed

- README: replaced misleading coverage badge with CI status badge
- README: updated CI/Husky examples with `--local-only`

## [0.1.6] - 2025

- CLI published to npm as `agentchecker`
- Landing page on Vercel
- Global agent config scanning (`~/.cursor`, `~/.codex`, etc.)
