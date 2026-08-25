import type { Contradiction, Fact, FactCategory } from '../types.js';

const INCOMPATIBLE: Partial<Record<FactCategory, string[][]>> = {
  'package-manager': [
    ['pnpm', 'npm'],
    ['pnpm', 'yarn'],
    ['pnpm', 'bun'],
    ['npm', 'yarn'],
    ['npm', 'bun'],
    ['yarn', 'bun'],
  ],
  linter: [
    ['oxlint', 'eslint'],
    ['oxlint', 'biome'],
    ['eslint', 'biome'],
  ],
  formatter: [
    ['prettier', 'biome'],
    ['prettier', 'dprint'],
    ['biome', 'dprint'],
  ],
  'test-runner': [['vitest', 'jest']],
  'shell-environment': [
    ['wsl', 'windows'],
    ['wsl2', 'windows'],
    ['wsl', 'macos'],
    ['wsl2', 'macos'],
    ['windows', 'macos'],
    ['windows', 'linux'],
    ['macos', 'linux'],
  ],
  'package-runner': [
    ['npx', 'pnpm dlx'],
    ['npx', 'bunx'],
    ['npx', 'yarn dlx'],
    ['pnpm dlx', 'bunx'],
    ['pnpm dlx', 'yarn dlx'],
  ],
  language: [
    ['spanish', 'english'],
    ['español', 'english'],
    ['spanish', 'inglés'],
    ['español', 'inglés'],
  ],
};

function valuesConflict(category: FactCategory, a: string, b: string): boolean {
  if (a === b) return false;
  const pairs = INCOMPATIBLE[category] ?? [];
  return pairs.some(([left, right]) => (left === a && right === b) || (left === b && right === a));
}

export function findContradictions(facts: Fact[]): Contradiction[] {
  const byCategory = new Map<FactCategory, Fact[]>();

  for (const fact of facts) {
    const list = byCategory.get(fact.category) ?? [];
    list.push(fact);
    byCategory.set(fact.category, list);
  }

  const contradictions: Contradiction[] = [];

  for (const [category, categoryFacts] of byCategory) {
    const distinctValues = [...new Set(categoryFacts.map((fact) => fact.value))];
    const conflicting = distinctValues.filter((value, _, all) =>
      all.some((other) => other !== value && valuesConflict(category, value, other)),
    );

    if (conflicting.length < 2) continue;

    const values = conflicting.map((value) => {
      const related = categoryFacts.filter((fact) => fact.value === value);
      return {
        value,
        files: [...new Set(related.map((fact) => fact.filePath))],
        evidence: related.map((fact) => fact.evidence),
      };
    });

    contradictions.push({
      category,
      values,
      recommendation: '',
    });
  }

  return contradictions;
}
