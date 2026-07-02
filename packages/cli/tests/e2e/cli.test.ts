import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cliEntry = path.join(packageRoot, 'dist/cli.js');
const fixturesDir = path.join(packageRoot, 'tests/fixtures');

describe('cli e2e', () => {
  it('exits 1 on --check-only when contradictions exist', async () => {
    await expect(
      execFileAsync(
        'node',
        [
          cliEntry,
          '--check-only',
          '--local-only',
          '--project-dir',
          path.join(fixturesDir, 'cursor-claude-conflict'),
        ],
        { cwd: packageRoot },
      ),
    ).rejects.toMatchObject({ code: 1 });
  });

  it('exits 0 on --check-only when aligned', async () => {
    const { stdout } = await execFileAsync(
      'node',
      [
        cliEntry,
        '--check-only',
        '--local-only',
        '--project-dir',
        path.join(fixturesDir, 'copilot-agents-ok'),
      ],
      { cwd: packageRoot },
    );
    expect(stdout).toContain('No contradictions');
  });

  it('supports --dry-run without writing', async () => {
    const { stdout } = await execFileAsync(
      'node',
      [
        cliEntry,
        '--dry-run',
        '-y',
        '--project-dir',
        path.join(fixturesDir, 'cursor-claude-conflict'),
      ],
      { cwd: packageRoot },
    );
    expect(stdout).toContain('Dry run complete');
  });

  it('supports --local-only without scanning global home configs', async () => {
    const { stdout } = await execFileAsync(
      'node',
      [
        cliEntry,
        '--check-only',
        '--local-only',
        '--project-dir',
        path.join(fixturesDir, 'no-agent-files'),
      ],
      { cwd: packageRoot },
    );
    expect(stdout).not.toContain('~/');
    expect(stdout).toContain('No AI agent instruction files found');
  });
});
