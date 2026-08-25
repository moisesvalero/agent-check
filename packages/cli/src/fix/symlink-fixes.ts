import fs from 'node:fs';
import path from 'node:path';
import type { AgentFile } from '../types.js';

export const CANONICAL_TOOL_TARGETS = [
  'CLAUDE.md',
  '.cursorrules',
  '.github/copilot-instructions.md',
  '.windsurfrules',
  '.clinerules',
];

export function createSymlinksToShared(
  files: AgentFile[],
  projectDir: string,
): { targetPath: string; symlinkCreated: boolean; error?: string }[] {
  const results: { targetPath: string; symlinkCreated: boolean; error?: string }[] = [];
  const sharedPath = path.join(projectDir, 'AGENTS.md');

  // Ensure AGENTS.md exists
  if (!fs.existsSync(sharedPath)) {
    fs.writeFileSync(
      sharedPath,
      '# AGENTS.md\n\nShared AI instructions for this repository.\n',
      'utf8',
    );
  }

  for (const agentFile of files) {
    if (agentFile.kind === 'shared' || agentFile.kind === 'global') {
      continue;
    }

    const fullPath = agentFile.path;
    const fileDir = path.dirname(fullPath);
    const relToShared = path.relative(fileDir, sharedPath);

    try {
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      try {
        const stat = fs.lstatSync(fullPath);
        if (stat.isSymbolicLink() || stat.isFile()) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // file doesn't exist yet
      }
      fs.symlinkSync(relToShared, fullPath, 'file');
      results.push({ targetPath: fullPath, symlinkCreated: true });
    } catch (err: unknown) {
      results.push({
        targetPath: fullPath,
        symlinkCreated: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

export function initProjectAgents(
  projectDir: string,
  createSymlinks = false,
): {
  createdAgentsMd: boolean;
  symlinks: { targetPath: string; symlinkCreated: boolean; error?: string }[];
} {
  const sharedPath = path.join(projectDir, 'AGENTS.md');
  let createdAgentsMd = false;

  if (!fs.existsSync(sharedPath)) {
    const template = `# Agent Instructions (AGENTS.md)

Shared rules for all AI coding assistants (Cursor, Claude, Copilot, Windsurf, Cline, Aider).

## Stack & Environment

- **Package manager:** pnpm
- **Runtime:** Node.js >= 20
- **Language:** TypeScript (strict mode)
- **Linter:** oxlint
- **Formatter:** prettier
- **Test runner:** vitest

## Conventions

- Keep edits minimal and focused.
- Run tests and linters before finishing.
- Never commit secrets or .env files.
`;
    fs.writeFileSync(sharedPath, template, 'utf8');
    createdAgentsMd = true;
  }

  const symlinks: { targetPath: string; symlinkCreated: boolean; error?: string }[] = [];
  if (createSymlinks) {
    for (const relPath of CANONICAL_TOOL_TARGETS) {
      const fullPath = path.join(projectDir, relPath);
      const fileDir = path.dirname(fullPath);
      const relToShared = path.relative(fileDir, sharedPath);

      try {
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }
        try {
          const stat = fs.lstatSync(fullPath);
          if (stat.isSymbolicLink() || stat.isFile()) {
            fs.unlinkSync(fullPath);
          }
        } catch {
          // file doesn't exist
        }
        fs.symlinkSync(relToShared, fullPath, 'file');
        symlinks.push({ targetPath: fullPath, symlinkCreated: true });
      } catch (err: unknown) {
        symlinks.push({
          targetPath: fullPath,
          symlinkCreated: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return { createdAgentsMd, symlinks };
}
