import { describe, expect, it } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createSymlinksToShared } from '../src/fix/symlink-fixes.js';
import type { AgentFile } from '../src/types.js';

describe('createSymlinksToShared', () => {
  it('replaces tool-specific rule file with symlink to AGENTS.md', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-symlink-test-'));
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    fs.writeFileSync(claudePath, '# Claude rules', 'utf8');

    const agentFiles: AgentFile[] = [
      {
        path: claudePath,
        relativePath: 'CLAUDE.md',
        agent: 'claude',
        kind: 'tool-specific',
        content: '# Claude rules',
      },
    ];

    const results = createSymlinksToShared(agentFiles, tmpDir);
    expect(results).toHaveLength(1);
    expect(results[0]?.symlinkCreated).toBe(true);

    const isSymlink = fs.lstatSync(claudePath).isSymbolicLink();
    expect(isSymlink).toBe(true);

    const sharedContent = fs.readFileSync(claudePath, 'utf8');
    expect(sharedContent).toContain('AGENTS.md');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
