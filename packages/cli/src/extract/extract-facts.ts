import type { Fact, FactCategory, AgentFile } from '../types.js';
import { getLines } from './normalize-markdown.js';

type CheckDefinition = {
  category: FactCategory;
  values: string[];
};

const NEGATION_WORDS =
  /\b(?:never|not|don't|dont|do\s+not|avoid|forbidden|deprecated|nunca|jam[aá]s|evitar|prohibid[oa]s?|sin|no\s+(?:use|uses|usar|run|install|ejecutar))\b/i;
const AFFIRMATIVE_RESET = /\b(?:always|siempre|instead|en\s+cambio|pero|prefer|prefier[a-z]*)\b/i;

function isMatchNegated(line: string, matchIndex: number): boolean {
  const prefix = line.slice(0, matchIndex);

  // Caso 1: Dentro de un paréntesis (ej. (never npm, yarn, or bun))
  const openParen = prefix.lastIndexOf('(');
  const closeParen = prefix.lastIndexOf(')');
  if (openParen > closeParen) {
    const insideParen = prefix.slice(openParen + 1);
    return NEGATION_WORDS.test(insideParen);
  }

  // Caso 2: Fuera de paréntesis - buscar la última cláusula
  const clauseStart = Math.max(
    prefix.lastIndexOf('.'),
    prefix.lastIndexOf(';'),
    prefix.lastIndexOf(','),
    prefix.lastIndexOf('|'),
    prefix.lastIndexOf(':'),
    0,
  );
  const clause = prefix.slice(clauseStart);

  if (NEGATION_WORDS.test(clause)) {
    // Si dentro de la misma cláusula aparece una palabra afirmativa tras la negación, ya no está negado
    const negationMatch = NEGATION_WORDS.exec(clause);
    if (negationMatch) {
      const afterNegation = clause.slice(negationMatch.index + negationMatch[0].length);
      if (AFFIRMATIVE_RESET.test(afterNegation)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

const LANGUAGE_DIRECTIVE =
  /\b(?:language|idioma|respond|responde|response|output|habla|speak|always\s+in|siempre\s+en)\b/i;

const CHECK_DEFINITIONS: CheckDefinition[] = [
  {
    category: 'package-manager',
    values: ['pnpm', 'npm', 'yarn', 'bun'],
  },
  {
    category: 'linter',
    values: ['oxlint', 'eslint', 'biome'],
  },
  {
    category: 'formatter',
    values: ['prettier', 'biome', 'dprint'],
  },
  {
    category: 'test-runner',
    values: ['vitest', 'jest', 'playwright', 'cypress'],
  },
  {
    category: 'shell-environment',
    values: ['wsl', 'wsl2', 'windows', 'macos', 'linux'],
  },
  {
    category: 'package-runner',
    values: ['npx', 'pnpm dlx', 'bunx', 'yarn dlx'],
  },
  {
    category: 'language',
    values: ['spanish', 'english', 'español', 'inglés'],
  },
];

function detectValuesOnLine(line: string, def: CheckDefinition): string[] {
  if (def.category === 'language' && !LANGUAGE_DIRECTIVE.test(line)) {
    return [];
  }

  const found: string[] = [];
  for (const value of def.values) {
    const regex = new RegExp(`\\b${value}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (!isMatchNegated(line, match.index)) {
        found.push(value.toLowerCase());
        break; // Un match positivo por valor en la línea
      }
    }
  }
  return found;
}

function extractFactsFromFile(file: AgentFile): Fact[] {
  const facts: Fact[] = [];
  const lines = getLines(file.content);

  for (const def of CHECK_DEFINITIONS) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('```')) continue;

      const values = detectValuesOnLine(line, def);
      for (const value of values) {
        const duplicate = facts.some(
          (fact) =>
            fact.category === def.category &&
            fact.value === value &&
            fact.filePath === file.path &&
            fact.line === i + 1,
        );
        if (duplicate) continue;

        facts.push({
          category: def.category,
          value,
          filePath: file.path,
          line: i + 1,
          evidence: line.trim(),
        });
      }
    }
  }

  return facts;
}

export function extractFacts(files: AgentFile[]): Fact[] {
  return files.flatMap(extractFactsFromFile);
}
