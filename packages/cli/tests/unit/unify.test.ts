import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { unifyAgentFiles } from '../../src/fix/unify-rules.js';
import type { AgentFile } from '../../src/types.js';

describe('unifyAgentFiles', () => {
  it('merges proprietary files into AGENTS.md and symlinks them', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-unify-test-'));
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    const cursorPath = path.join(tmpDir, '.cursorrules');

    fs.writeFileSync(claudePath, 'Use pnpm always.\n');
    fs.writeFileSync(cursorPath, 'Use oxlint for linting.\n');

    const files: AgentFile[] = [
      {
        path: claudePath,
        relativePath: 'CLAUDE.md',
        agent: 'claude',
        kind: 'tool-specific',
        content: 'Use pnpm always.\n',
      },
      {
        path: cursorPath,
        relativePath: '.cursorrules',
        agent: 'cursor',
        kind: 'tool-specific',
        content: 'Use oxlint for linting.\n',
      },
    ];

    const res = unifyAgentFiles(files, tmpDir);
    expect(res.unifiedAgentsMd).toBe(true);
    expect(res.mergedFiles).toEqual(['CLAUDE.md', '.cursorrules']);

    const agentsMdContent = fs.readFileSync(path.join(tmpDir, 'AGENTS.md'), 'utf8');
    expect(agentsMdContent).toContain('Use pnpm always.');
    expect(agentsMdContent).toContain('Use oxlint for linting.');

    // Verificar que los archivos ahora son enlaces simbólicos
    expect(fs.lstatSync(claudePath).isSymbolicLink()).toBe(true);
    expect(fs.lstatSync(cursorPath).isSymbolicLink()).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
