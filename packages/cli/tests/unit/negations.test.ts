import { describe, expect, it } from 'vitest';
import { extractFacts } from '../../src/extract/extract-facts.js';
import type { AgentFile } from '../../src/types.js';

describe('extractFacts with negation detection', () => {
  it('ignores negated package manager (Never use npm, use pnpm)', () => {
    const file: AgentFile = {
      path: 'CLAUDE.md',
      relativePath: 'CLAUDE.md',
      agent: 'claude',
      kind: 'tool-specific',
      content: 'Never use npm, always use pnpm for all operations.\n',
    };

    const facts = extractFacts([file]);
    const pmFacts = facts.filter((f) => f.category === 'package-manager');
    expect(pmFacts).toHaveLength(1);
    expect(pmFacts[0]?.value).toBe('pnpm');
  });

  it('ignores Spanish negations (Nunca uses eslint, usa oxlint)', () => {
    const file: AgentFile = {
      path: 'AGENTS.md',
      relativePath: 'AGENTS.md',
      agent: 'shared',
      kind: 'shared',
      content: 'Nunca uses eslint; usa siempre oxlint en este repo.\n',
    };

    const facts = extractFacts([file]);
    const linterFacts = facts.filter((f) => f.category === 'linter');
    expect(linterFacts).toHaveLength(1);
    expect(linterFacts[0]?.value).toBe('oxlint');
  });

  it('detects language preference', () => {
    const file: AgentFile = {
      path: 'CLAUDE.md',
      relativePath: 'CLAUDE.md',
      agent: 'claude',
      kind: 'tool-specific',
      content: 'Responde siempre en español.\n',
    };

    const facts = extractFacts([file]);
    const langFacts = facts.filter((f) => f.category === 'language');
    expect(langFacts.length).toBeGreaterThanOrEqual(1);
    expect(langFacts[0]?.value).toBe('español');
  });

  it('handles parenthesized list negations (pnpm (never npm, yarn, or bun))', () => {
    const file: AgentFile = {
      path: 'AGENTS.md',
      relativePath: 'AGENTS.md',
      agent: 'shared',
      kind: 'shared',
      content: '- **Package manager:** pnpm (never npm, yarn, or bun)\n',
    };

    const facts = extractFacts([file]);
    const pmFacts = facts.filter((f) => f.category === 'package-manager');
    expect(pmFacts).toHaveLength(1);
    expect(pmFacts[0]?.value).toBe('pnpm');
  });
});
