import { describe, expect, it } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { auditDependencies } from '../src/compare/audit-deps.js';
import type { Fact } from '../src/types.js';

describe('auditDependencies', () => {
  it('detects linter mismatch when rule requires eslint but project has oxlint', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-audit-test-'));
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ devDependencies: { oxlint: '^0.16.0' } }),
    );

    const facts: Fact[] = [
      {
        category: 'linter',
        value: 'eslint',
        filePath: 'CLAUDE.md',
        line: 2,
        evidence: 'Use eslint',
      },
    ];

    const mismatches = auditDependencies(facts, tmpDir);
    expect(mismatches).toHaveLength(1);
    expect(mismatches[0]?.ruleValue).toBe('eslint');
    expect(mismatches[0]?.expectedDependency).toBe('oxlint');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns no mismatches when project has matching linter', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-audit-test-'));
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ devDependencies: { oxlint: '^0.16.0' } }),
    );

    const facts: Fact[] = [
      {
        category: 'linter',
        value: 'oxlint',
        filePath: 'AGENTS.md',
        line: 1,
        evidence: 'Use oxlint',
      },
    ];

    const mismatches = auditDependencies(facts, tmpDir);
    expect(mismatches).toHaveLength(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
