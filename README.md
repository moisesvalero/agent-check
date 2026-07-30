# agentchecker

<p align="center">
  <strong>One command. All your AI agents agree.</strong><br>
  <em>Un solo comando. Todos tus agentes de IA alineados.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agentchecker"><img src="https://img.shields.io/npm/v/agentchecker?color=00ff41&labelColor=131313&style=flat-square" alt="npm version"></a>
  <a href="https://github.com/moisesvalero/agentchecker/blob/main/LICENSE"><img src="https://img.shields.io/github/license/moisesvalero/agentchecker?color=3b82f6&labelColor=131313&style=flat-square" alt="license"></a>
  <a href="https://github.com/moisesvalero/agentchecker/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/moisesvalero/agentchecker/ci.yml?branch=main&color=00ff41&labelColor=131313&style=flat-square" alt="CI status"></a>
  <a href="https://agentcheck-rho.vercel.app"><img src="https://img.shields.io/badge/website-agentcheck--rho.vercel.app-00ff41?labelColor=131313&style=flat-square" alt="landing page"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-3b82f6?labelColor=131313&style=flat-square" alt="PRs welcome">
</p>

---

<p align="center">
  <a href="#english">English</a> • 
  <a href="#español">Español</a>
</p>

---

<a id="english"></a>

## English

### The Problem: The "Rule Drift"

When you pair program with multiple AI coding tools, each one reads a different instructions or rules file in your repository:

- **Cursor** reads `.cursorrules` or `.cursor/rules/*.mdc`
- **Claude Code** reads `CLAUDE.md` or `.claude/CLAUDE.md`
- **GitHub Copilot** reads `.github/copilot-instructions.md`
- **Humans & Shared Agents** read `AGENTS.md`

Over time, these rules drift apart. Cursor starts using `pnpm` and `eslint`, Claude defaults to `npm` and `oxlint`, and Copilot reformats everything with `biome`. **The result? Conflicted generation, compilation errors, and wasted API tokens.**

```mermaid
graph TD
    classDef problem fill:#1a1a1a,stroke:#ff6b6b,stroke-width:1.5px,color:#ff6b6b;
    classDef solution fill:#1a1a1a,stroke:#00ff41,stroke-width:1.5px,color:#00ff41;
    classDef neutral fill:#131313,stroke:#3b82f6,stroke-width:1.5px,color:#adc6ff;

    A[Developer Workspace]:::neutral --> B[Cursor: .cursor/rules]:::problem
    A --> C[Claude Code: CLAUDE.md]:::problem
    A --> D[Copilot: copilot-instructions]:::problem

    B --> E["Rule: use pnpm, eslint"]:::problem
    C --> F["Rule: use npm, oxlint"]:::problem
    D --> G["Rule: use yarn, biome"]:::problem

    E & F & G --> H[❌ AI Rule Contradictions]:::problem
    H --> I[npx agentchecker]:::solution
    I --> J[✓ Unified Rules across all tools!]:::solution
```

### The Solution

`agentchecker` is a zero-dependency, ultra-fast CLI tool that:

1. **Scans** your project's local agent files AND your global tool configs (`~/.claude/`, `~/.cursor/rules/`, `~/.codex/`, etc.).
2. **Extracts & parses** tech stack decisions (package managers, linters, formatters, test runners, shell environments).
3. **Highlights contradictions** across all sources with a clean, terminal-based diagnostic report.
4. **Fixes them interactively** — only modifying local project files. Global configs are always **read-only**.
5. **Creates `AGENTS.md`** automatically if no local config exists, locking in your choices for this project.

<p align="center">
  <img src="demo.gif" alt="agentchecker terminal demo" width="720">
</p>

<p align="center">
  <a href="https://asciinema.org/a/RjSsDnzYvvVyoYC4">▶ Interactive terminal demo (asciinema)</a>
</p>

> GIF preview for GitHub. Click the link above for the full interactive player with copy/paste.

---

### Quick Start: Zero Installation

> [!IMPORTANT]
> **No installation required.** Run it instantly using `npx` directly in the root of your project:
>
> ```bash
> npx agentchecker
> ```
>
> _No configuration files, no global packages, no environment setup. Just run and align all your agents in 2 seconds._

---

### Professional Workflow Integration

To get the most out of `agentchecker` and guarantee that your rules never drift again, integrate it into your daily workflow:

#### 1. Pre-commit Hook (Husky)

Prevent committing conflicting instructions. Add this to your `.husky/pre-commit` or Git hooks runner:

```bash
npx agentchecker --check-only --local-only
```

_It will scan project files and exit with code `1` if any contradiction exists, halting the commit. Omit `--local-only` to also include global tool configs from your home directory._

#### 2. CI/CD Pipeline (GitHub Actions)

Ensure team pull requests don't introduce conflicting rules. This repo uses [`.github/workflows/ci.yml`](.github/workflows/ci.yml) with a dedicated `agent-check` job:

```yaml
name: AI Agent Rules Check
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm --filter agentchecker build
      - run: node packages/cli/dist/cli.js --check-only --local-only
```

Use `--local-only` in CI so builds only validate repository files, not each developer's global home configs.

---

### Supported Tools & Instruction Files

`agentchecker` unifies the configurations of the industry's most popular AI coding assistants, editors, and agents:

| AI Program / Agent               | Project-Level Rules                                                         | Global / User Rules                                                | Format          |
| :------------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------- | :-------------- |
| **Cursor**                       | `.cursorrules`, `.cursor/rules/*.mdc`                                       | _Sidebar settings / Profiles_                                      | Markdown / MDC  |
| **Claude Code**                  | `CLAUDE.md`, `.claude/CLAUDE.md`                                            | `~/.claude/CLAUDE.md`                                              | Markdown        |
| **GitHub Copilot**               | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | _Copilot global settings_                                          | Markdown        |
| **Codex App**                    | `AGENTS.md`, `.codex/config.toml`                                           | `~/.codex/AGENTS.md`, `~/.codex/config.toml`                       | Markdown / TOML |
| **Antigravity 2.0**              | `.gemini/gemini.md`, `.gemini.md`, `gemini.md`                              | _Gemini global custom settings_                                    | Markdown        |
| **OpenCode**                     | `AGENTS.md`, `.opencode.json`                                               | `~/.config/opencode/AGENTS.md`, `~/.config/opencode/opencode.json` | Markdown / JSON |
| **Windsurf**                     | `.windsurfrules`, `.windsurf/rules/`                                        | _Cascade Sidebar custom rules_                                     | Markdown        |
| **Roo Cline (Roo Code / Cline)** | `.clinerules`, `.clinerules/`, `.roo/rules/`                                | `.clinerules-<mode>`                                               | Markdown        |
| **Aider**                        | `CONVENTIONS.md`, `.aider.conf.yml`                                         | `~/.aider.conf.yml`                                                | Markdown / YAML |

#### Analyzed Tooling Categories

- **Package Managers**: `pnpm`, `npm`, `yarn`, `bun`
- **Linters**: `oxlint`, `eslint`, `biome`
- **Formatters**: `prettier`, `biome`, `dprint`
- **Test Runners**: `vitest`, `jest`, `playwright`

#### Request support for a new agent

Missing your tool? Open a [support request](https://github.com/moisesvalero/agentchecker/issues/new?template=agent-support.yml) and include:

1. **Tool name** (e.g. Continue.dev)
2. **Project rule paths** — exact files or globs (e.g. `.continue/rules/*.md`)
3. **Global paths** (if any) — e.g. `~/.config/foo/rules.md`
4. **Format** — Markdown, JSON, YAML, TOML…
5. **Docs link** — official reference for where rules live
6. **Example snippet** — a few lines with package manager / linter / formatter rules

We only add tools that store instructions in **files on disk**. IDE-only settings (Copilot global UI, Cursor profiles without files, etc.) cannot be scanned reliably.

PRs welcome: add patterns in [`packages/cli/src/scan/known-files.ts`](packages/cli/src/scan/known-files.ts) + a fixture under `packages/cli/tests/fixtures/`.

---

### Command Line Options

```bash
agentchecker: fix contradictions between AI agent instruction files

Usage:
  npx agentchecker [options]

Options:
  --dry-run       Show contradictions and preview without writing
  --check-only    Exit 1 if contradictions exist (CI mode)
  --local-only    Scan only project files, skip global home configs
  --symlink       Replace tool-specific rule files with symlinks to AGENTS.md
  --audit-deps    Audit rules against installed package.json dependencies
  -y, --yes       Apply recommended fixes without prompts
  -a, --agent     Limit scan to agents: cursor, claude, copilot, shared
  --project-dir   Project directory to scan (default: cwd)
  -v, --verbose   Verbose output
  -h, --help      Show help
```

---

### Local Development

```bash
git clone https://github.com/moisesvalero/agentchecker.git
cd agentchecker
pnpm install
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm agent-check
pnpm dev:web
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full development guidelines.

---

---

<a id="español"></a>

## Español

### El Problema: La desviación de reglas (Rule Drift)

Cuando programas en pareja con varias herramientas de IA al mismo tiempo, cada una de ellas lee un archivo de configuración e instrucciones diferente en tu repositorio:

- **Cursor** lee `.cursorrules` o `.cursor/rules/*.mdc`
- **Claude Code** lee `CLAUDE.md` o `.claude/CLAUDE.md`
- **GitHub Copilot** lee `.github/copilot-instructions.md`
- **Humanos y Agentes Compartidos** leemos `AGENTS.md`

Con el tiempo, estas reglas inevitablemente divergen. Cursor empezará a usar `pnpm` y `eslint`, Claude asumirá por defecto `npm` y `oxlint`, y Copilot reformateará el código usando `biome`. **¿El resultado? Comportamiento errático de los agentes, errores de compilación y pérdida innecesaria de tokens de API.**

```mermaid
graph TD
    classDef problem fill:#1a1a1a,stroke:#ff6b6b,stroke-width:1.5px,color:#ff6b6b;
    classDef solution fill:#1a1a1a,stroke:#00ff41,stroke-width:1.5px,color:#00ff41;
    classDef neutral fill:#131313,stroke:#3b82f6,stroke-width:1.5px,color:#adc6ff;

    A[Workspace de Desarrollo]:::neutral --> B[Cursor: .cursor/rules]:::problem
    A --> C[Claude Code: CLAUDE.md]:::problem
    A --> D[Copilot: copilot-instructions]:::problem

    B --> E["Regla: usar pnpm, eslint"]:::problem
    C --> F["Regla: usar npm, oxlint"]:::problem
    D --> G["Regla: usar yarn, biome"]:::problem

    E & F & G --> H[❌ Contradicciones de Reglas de IA]:::problem
    H --> I[npx agentchecker]:::solution
    I --> J[✓ Reglas unificadas en todas las herramientas]:::solution
```

### La Solución

`agentchecker` es una herramienta CLI extremadamente rápida y sin dependencias externas que:

1. **Escanea** tanto los archivos locales de tu proyecto como tus configuraciones globales de herramientas (`~/.claude/`, `~/.cursor/rules/`, `~/.codex/`, etc.).
2. **Extrae y analiza** las decisiones tecnológicas (gestores de paquetes, linters, formateadores, ejecutores de tests, entornos de shell).
3. **Resalta las contradicciones** entre todas las fuentes con un informe de diagnóstico claro en la terminal.
4. **Las corrige interactivamente**, modificando únicamente los archivos locales del proyecto. Las configuraciones globales son siempre de **solo lectura**.
5. **Crea `AGENTS.md`** automáticamente si no existe ninguna configuración local, asegurando tus elecciones para este proyecto.

<p align="center">
  <img src="demo.gif" alt="demo de agentchecker en terminal" width="720">
</p>

<p align="center">
  <a href="https://asciinema.org/a/RjSsDnzYvvVyoYC4">▶ Demo interactiva en terminal (asciinema)</a>
</p>

> Vista previa en GIF para GitHub. Usa el enlace para el reproductor interactivo completo.

---

### Inicio Rápido: Cero Instalación

> [!IMPORTANT]
> **No requiere instalación.** Ejecútalo al instante usando `npx` directamente en la raíz de tu proyecto:
>
> ```bash
> npx agentchecker
> ```
>
> _Sin archivos de configuración previos, sin descargas globales, sin fricción de configuración inicial. Ejecuta y alinea todos tus agentes en 2 segundos._

---

### Integración en tu Flujo Diario de Trabajo

Para maximizar el valor de `agentchecker` y asegurar que tus reglas nunca se vuelvan a desviar, intégralo en tus herramientas habituales:

#### 1. Git Hook Pre-commit (Husky)

Evita subir instrucciones conflictivas al repositorio. Añade esto a tu `.husky/pre-commit` o tu gestor de hooks de Git:

```bash
npx agentchecker --check-only --local-only
```

_Si se detecta una contradicción en los archivos del proyecto, la herramienta saldrá con código `1` y detendrá el commit. Omite `--local-only` para incluir también las configuraciones globales de tu directorio home._

#### 2. Pipeline de Integración Continua (GitHub Actions)

Garantiza que ningún pull request introduzca reglas conflictivas. Este repositorio usa [`.github/workflows/ci.yml`](.github/workflows/ci.yml) con un job `agent-check` dedicado:

```yaml
name: AI Agent Rules Check
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm --filter agentchecker build
      - run: node packages/cli/dist/cli.js --check-only --local-only
```

Usa `--local-only` en CI para validar solo los archivos del repositorio, no las configuraciones globales de cada desarrollador.

---

### Herramientas y Archivos Soportados

`agentchecker` unifica las configuraciones de los asistentes de código de IA, editores y agentes más populares de la industria:

| Programa / Agente de IA          | Reglas a Nivel de Proyecto                                                  | Reglas Globales / de Usuario                                       | Formato         |
| :------------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------- | :-------------- |
| **Cursor**                       | `.cursorrules`, `.cursor/rules/*.mdc`                                       | _Ajustes de barra lateral / Perfiles_                              | Markdown / MDC  |
| **Claude Code**                  | `CLAUDE.md`, `.claude/CLAUDE.md`                                            | `~/.claude/CLAUDE.md`                                              | Markdown        |
| **GitHub Copilot**               | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | _Ajustes globales de Copilot_                                      | Markdown        |
| **Codex App**                    | `AGENTS.md`, `.codex/config.toml`                                           | `~/.codex/AGENTS.md`, `~/.codex/config.toml`                       | Markdown / TOML |
| **Antigravity 2.0**              | `.gemini/gemini.md`, `.gemini.md`, `gemini.md`                              | _Ajustes globales de Gemini_                                       | Markdown        |
| **OpenCode**                     | `AGENTS.md`, `.opencode.json`                                               | `~/.config/opencode/AGENTS.md`, `~/.config/opencode/opencode.json` | Markdown / JSON |
| **Windsurf**                     | `.windsurfrules`, `.windsurf/rules/`                                        | _Reglas personalizadas de Cascade_                                 | Markdown        |
| **Roo Cline (Roo Code / Cline)** | `.clinerules`, `.clinerules/`, `.roo/rules/`                                | `.clinerules-<mode>`                                               | Markdown        |
| **Aider**                        | `CONVENTIONS.md`, `.aider.conf.yml`                                         | `~/.aider.conf.yml`                                                | Markdown / YAML |

#### Categorías Analizadas

- **Gestores de paquetes**: `pnpm`, `npm`, `yarn`, `bun`
- **Linters**: `oxlint`, `eslint`, `biome`
- **Formateadores**: `prettier`, `biome`, `dprint`
- **Test Runners**: `vitest`, `jest`, `playwright`

#### Solicitar soporte para un agente nuevo

¿Falta tu herramienta? Abre una [solicitud de soporte](https://github.com/moisesvalero/agentchecker/issues/new?template=agent-support.yml) e incluye:

1. **Nombre de la herramienta** (ej. Continue.dev)
2. **Rutas de reglas en el proyecto** — archivos o globs exactos (ej. `.continue/rules/*.md`)
3. **Rutas globales** (si las hay) — ej. `~/.config/foo/rules.md`
4. **Formato** — Markdown, JSON, YAML, TOML…
5. **Enlace a la documentación oficial** — dónde define esa herramienta sus reglas
6. **Fragmento de ejemplo** — unas líneas con gestor de paquetes, linter, formateador, etc.

Solo añadimos herramientas que guardan instrucciones en **archivos en disco**. Ajustes solo de IDE (UI global de Copilot, perfiles de Cursor sin archivos, etc.) no se pueden escanear de forma fiable.

PRs bienvenidos: patrones en [`packages/cli/src/scan/known-files.ts`](packages/cli/src/scan/known-files.ts) + fixture en `packages/cli/tests/fixtures/`.

---

### Parámetros de Consola (Flags)

```bash
agentchecker: fix contradictions between AI agent instruction files

Uso:
  npx agentchecker [opciones]

Opciones:
  --dry-run       Muestra contradicciones y previsualiza cambios sin escribir
  --check-only    Sale con código 1 si existen contradicciones (modo CI)
  --local-only    Escanea solo archivos del proyecto, sin configs globales del home
  --symlink       Reemplaza archivos propietarios por symlinks apuntando a AGENTS.md
  --audit-deps    Audita reglas contra las dependencias instaladas en package.json
  -y, --yes       Aplica las soluciones recomendadas de forma automática
  -a, --agent     Limita el análisis a: cursor, claude, copilot, shared
  --project-dir   Directorio a escanear (por defecto: cwd)
  -v, --verbose   Salida detallada (modo debug)
  -h, --help      Muestra la ayuda
```

---

### Desarrollo Local

```bash
git clone https://github.com/moisesvalero/agentchecker.git
cd agentchecker
pnpm install
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm agent-check
pnpm dev:web
```

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para las guías completas de desarrollo.

---

## License / Licencia

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
