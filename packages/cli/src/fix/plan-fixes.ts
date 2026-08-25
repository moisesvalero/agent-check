import type { Contradiction, FactCategory, FileChange } from '../types.js';

const PACKAGE_REPLACEMENTS: Record<string, string> = {
  'npm install': 'pnpm install',
  'npm run': 'pnpm run',
  'npm ci': 'pnpm install --frozen-lockfile',
  'yarn install': 'pnpm install',
  'bun install': 'pnpm install',
};

function replaceLosersOnLine(
  line: string,
  losers: string[],
  chosen: string,
  category: FactCategory,
): string {
  let updated = line;

  if (category === 'package-manager' && chosen === 'pnpm') {
    for (const [from, to] of Object.entries(PACKAGE_REPLACEMENTS)) {
      updated = updated.replace(new RegExp(from, 'gi'), to);
    }
  }

  for (const loser of losers) {
    const pattern = new RegExp(`\\b${loser}\\b`, 'i');
    if (pattern.test(updated) && !new RegExp(`\\b${chosen}\\b`, 'i').test(line)) {
      updated = updated.replace(new RegExp(`\\b${loser}\\b`, 'gi'), (match) => {
        if (match === match.toUpperCase()) return chosen.toUpperCase();
        if (match[0] === match[0]?.toUpperCase()) {
          return chosen.charAt(0).toUpperCase() + chosen.slice(1);
        }
        return chosen;
      });
    }
  }

  return updated;
}

export function planFixes(
  contradictions: Array<Contradiction & { chosen: string }>,
  fileContents: Map<string, string>,
): FileChange[] {
  const changes: FileChange[] = [];

  for (const [filePath, content] of fileContents) {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      let currentLine = originalLine;

      for (const contradiction of contradictions) {
        const fileHasLoser = contradiction.values.some(
          (entry) => entry.value !== contradiction.chosen && entry.files.includes(filePath),
        );
        if (!fileHasLoser) continue;

        const losers = contradiction.values
          .map((entry) => entry.value)
          .filter((value) => value !== contradiction.chosen);

        currentLine = replaceLosersOnLine(
          currentLine,
          losers,
          contradiction.chosen,
          contradiction.category,
        );
      }

      if (currentLine !== originalLine) {
        changes.push({
          filePath,
          line: i + 1,
          oldText: originalLine,
          newText: currentLine,
        });
      }
    }
  }

  return changes;
}

export function applyChangesToContent(content: string, changes: FileChange[]): string {
  const fileChanges = [...changes].sort((a, b) => b.line - a.line);
  const lines = content.split('\n');

  for (const change of fileChanges) {
    const index = change.line - 1;
    if (lines[index] === change.oldText) {
      lines[index] = change.newText;
    }
  }

  return lines.join('\n');
}
