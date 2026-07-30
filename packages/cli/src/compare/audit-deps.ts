import fs from 'node:fs';
import path from 'node:path';
import type { AuditMismatch, Fact } from '../types.js';

export function auditDependencies(facts: Fact[], projectDir: string): AuditMismatch[] {
  const mismatches: AuditMismatch[] = [];
  const pkgPath = path.join(projectDir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return mismatches;
  }

  let pkg: Record<string, any> = {};
  try {
    const rawJson = fs.readFileSync(pkgPath, 'utf8');
    pkg = JSON.parse(rawJson);
  } catch {
    return mismatches;
  }

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Group facts by category
  const categoryFacts = new Map<string, Fact[]>();
  for (const fact of facts) {
    const existing = categoryFacts.get(fact.category) || [];
    existing.push(fact);
    categoryFacts.set(fact.category, existing);
  }

  // 1. Audit Linter
  const linterFacts = categoryFacts.get('linter') || [];
  for (const fact of linterFacts) {
    const val = fact.value.toLowerCase();
    if (val === 'eslint' && !allDeps['eslint']) {
      const installedAlternative = allDeps['oxlint']
        ? 'oxlint'
        : allDeps['@biomejs/biome'] || allDeps['biome']
          ? 'biome'
          : null;

      mismatches.push({
        category: 'linter',
        ruleValue: 'eslint',
        expectedDependency: installedAlternative || 'eslint (not installed)',
        files: [fact.filePath],
        message: installedAlternative
          ? `Rule mandates 'eslint', but project has '${installedAlternative}' installed in package.json.`
          : `Rule mandates 'eslint', but 'eslint' is not installed in package.json.`,
      });
    } else if (val === 'oxlint' && !allDeps['oxlint'] && allDeps['eslint']) {
      mismatches.push({
        category: 'linter',
        ruleValue: 'oxlint',
        expectedDependency: 'eslint',
        files: [fact.filePath],
        message: `Rule mandates 'oxlint', but project has 'eslint' installed in package.json.`,
      });
    }
  }

  // 2. Audit Formatter
  const formatterFacts = categoryFacts.get('formatter') || [];
  for (const fact of formatterFacts) {
    const val = fact.value.toLowerCase();
    if (val === 'prettier' && !allDeps['prettier']) {
      const installedAlternative = allDeps['@biomejs/biome'] || allDeps['biome'] ? 'biome' : null;
      mismatches.push({
        category: 'formatter',
        ruleValue: 'prettier',
        expectedDependency: installedAlternative || 'prettier (not installed)',
        files: [fact.filePath],
        message: installedAlternative
          ? `Rule mandates 'prettier', but project has '${installedAlternative}' installed in package.json.`
          : `Rule mandates 'prettier', but 'prettier' is not installed in package.json.`,
      });
    }
  }

  // 3. Audit Package Manager vs Lockfiles
  const pmFacts = categoryFacts.get('package-manager') || [];
  const hasPnpmLock = fs.existsSync(path.join(projectDir, 'pnpm-lock.yaml'));
  const hasYarnLock = fs.existsSync(path.join(projectDir, 'yarn.lock'));
  const hasBunLock =
    fs.existsSync(path.join(projectDir, 'bun.lockb')) ||
    fs.existsSync(path.join(projectDir, 'bun.lock'));
  const hasNpmLock = fs.existsSync(path.join(projectDir, 'package-lock.json'));

  for (const fact of pmFacts) {
    const val = fact.value.toLowerCase();
    let expectedPm: string | null = null;
    if (hasPnpmLock && val !== 'pnpm') expectedPm = 'pnpm (pnpm-lock.yaml present)';
    else if (hasYarnLock && val !== 'yarn') expectedPm = 'yarn (yarn.lock present)';
    else if (hasBunLock && val !== 'bun') expectedPm = 'bun (bun.lock present)';
    else if (hasNpmLock && val !== 'npm' && !hasPnpmLock && !hasYarnLock)
      expectedPm = 'npm (package-lock.json present)';

    if (expectedPm) {
      mismatches.push({
        category: 'package-manager',
        ruleValue: val,
        expectedDependency: expectedPm,
        files: [fact.filePath],
        message: `Rule specifies '${val}', but workspace has '${expectedPm}'.`,
      });
    }
  }

  return mismatches;
}
