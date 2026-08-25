import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initProjectAgents } from '../../src/fix/symlink-fixes.js';

describe('initProjectAgents', () => {
  it('creates AGENTS.md and symlinks when directory is empty', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-init-test-'));

    const res = initProjectAgents(tmpDir, true);
    expect(res.createdAgentsMd).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'AGENTS.md'))).toBe(true);
    expect(res.symlinks.length).toBeGreaterThan(0);

    const createdSymlinks = res.symlinks.filter((s) => s.symlinkCreated);
    expect(createdSymlinks.length).toBe(res.symlinks.length);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('does not overwrite existing AGENTS.md', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-init-test-'));
    fs.writeFileSync(path.join(tmpDir, 'AGENTS.md'), '# Custom Rules\n');

    const res = initProjectAgents(tmpDir, false);
    expect(res.createdAgentsMd).toBe(false);
    expect(fs.readFileSync(path.join(tmpDir, 'AGENTS.md'), 'utf8')).toBe('# Custom Rules\n');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
