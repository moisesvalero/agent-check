/** Configuración central de SEO, GEO y AEO para la landing. */
const SITE_URL = 'https://agentcheck.moisesvalero.es';
export const PKG_VERSION = '0.3.0';

export const siteName = 'agentchecker';
const authorName = 'Moisés Valero';
const authorUrl = 'https://moisesvalero.es';
export const githubUrl = 'https://github.com/moisesvalero/agentchecker';
export const npmUrl = 'https://www.npmjs.com/package/agentchecker';
export const licenseUrl =
  'https://github.com/moisesvalero/agentchecker/blob/main/LICENSE';

export const canonicalUrl = `${SITE_URL}/`;
export const ogImageUrl = `${SITE_URL}/og-image.png`;

export const seoEn = {
  title: 'agentchecker — Fix AI Agent Instruction Conflicts in 2 Seconds',
  description:
    'agentchecker is a zero-install CLI that detects and fixes contradictions between AGENTS.md, CLAUDE.md, Cursor rules, Copilot instructions and other AI agent config files. Run npx agentchecker.',
  keywords:
    'agentchecker, AI agent instructions, AGENTS.md, CLAUDE.md, cursor rules, copilot instructions, AI conflict resolver, CLI tool, npx agentchecker',
  ogTitle: 'agentchecker — Fix AI Agent Instruction Conflicts in 2 Seconds',
  ogDescription:
    'Zero-install CLI that detects and fixes contradictions between AGENTS.md, CLAUDE.md, Cursor rules and Copilot instructions. Run npx agentchecker in any project.',
  twitterTitle: 'agentchecker — Fix AI Agent Instruction Conflicts',
  twitterDescription:
    'Zero-install CLI to fix contradictions between AGENTS.md, CLAUDE.md, Cursor rules and Copilot instructions. npx agentchecker',
  ogImageAlt:
    'agentchecker terminal showing contradiction detection between AI agent files',
} as const;

export const seoEs = {
  title:
    'agentchecker — Corrige conflictos entre instrucciones de agentes IA en 2 segundos',
  description:
    'agentchecker es un CLI sin instalación que detecta y corrige contradicciones entre AGENTS.md, CLAUDE.md, reglas de Cursor, instrucciones de Copilot y otros archivos de agentes IA. Ejecuta npx agentchecker.',
} as const;

type FaqItem = { question: string; answer: string };

export const faqsEn: FaqItem[] = [
  {
    question: 'What is agentchecker?',
    answer:
      'agentchecker is a zero-install command-line tool that detects and fixes contradictions between AI agent instruction files in a project. It scans files like AGENTS.md, CLAUDE.md, Cursor rules (.cursor/rules/), GitHub Copilot instructions (.github/copilot-instructions.md), Codex, OpenCode, Windsurf, and Aider configurations, then asks you which setting is correct and updates all files to agree.',
  },
  {
    question: 'How do I run agentchecker?',
    answer:
      "Run agentchecker without installation using npx: open a terminal in your project root and run 'npx agentchecker'. You can also run 'npx agentchecker --init' to generate a unified AGENTS.md and link all agent tools.",
  },
  {
    question: 'Can I use agentchecker in GitHub Actions CI?',
    answer:
      "Yes! You can use the official composite action in your workflow: 'uses: moisesvalero/agentchecker@main' or run 'npx agentchecker --check-only --local-only'. It exits with code 1 if rules contradict each other.",
  },
  {
    question: 'What AI agent files does agentchecker support?',
    answer:
      'agentchecker supports AGENTS.md (shared), CLAUDE.md and .claude/rules/*.md (Claude Code), .cursor/rules/*.mdc (Cursor), .github/copilot-instructions.md (GitHub Copilot), .codex/config.toml (Codex App), .gemini/gemini.md (Antigravity), .opencode.json (OpenCode), .windsurfrules (Windsurf), .clinerules (Cline/Roo), and .aider.conf.yml (Aider). It also scans global config files in ~/.claude/, ~/.cursor/rules/, ~/.codex/, and ~/.config/opencode/.',
  },
  {
    question:
      'Can agentchecker symlink rule files to AGENTS.md or audit package.json?',
    answer:
      "Yes! Run 'npx agentchecker --symlink' to replace tool-specific rules with relative symlinks to AGENTS.md. Run 'npx agentchecker --audit-deps' to audit rule claims against installed package.json dependencies and lockfiles.",
  },
  {
    question: 'What contradictions does agentchecker detect?',
    answer:
      'agentchecker detects contradictions across 7 categories: package manager (pnpm vs npm vs yarn vs bun), linter (oxlint vs eslint vs biome), formatter (prettier vs biome vs dprint), test runner (vitest vs jest vs playwright vs cypress), response language (spanish vs english), shell environment (WSL2 vs Windows vs macOS), and package runner (npx vs pnpm dlx vs bunx). It also intelligently ignores negated rules (e.g. "never use npm").',
  },
  {
    question: 'Does agentchecker modify global AI tool configuration files?',
    answer:
      'No. agentchecker reads global configuration files (like ~/.claude/CLAUDE.md or ~/.cursor/rules/) to detect contradictions, but it never modifies them. Only local project files are updated. If no local config exists, agentchecker offers to create an AGENTS.md file with your chosen settings.',
  },
  {
    question: 'Is agentchecker free?',
    answer:
      'Yes, agentchecker is completely free and open source under the MIT License.',
  },
];

export const faqsEs: FaqItem[] = [
  {
    question: '¿Qué es agentchecker?',
    answer:
      'agentchecker es una herramienta de línea de comandos sin instalación que detecta y corrige contradicciones entre archivos de instrucciones de agentes IA en un proyecto. Escanea AGENTS.md, CLAUDE.md, reglas de Cursor (.cursor/rules/), instrucciones de Copilot (.github/copilot-instructions.md), Codex, OpenCode, Windsurf y Aider, y luego te pregunta qué valor es el correcto para unificar todos los archivos.',
  },
  {
    question: '¿Cómo ejecuto agentchecker?',
    answer:
      "Ejecuta agentchecker sin instalar nada con npx: abre una terminal en la raíz de tu proyecto y ejecuta 'npx agentchecker'. También puedes usar 'npx agentchecker --init' para inicializar un AGENTS.md canónico y enlazar todas tus herramientas.",
  },
  {
    question: '¿Puedo usar agentchecker en el CI de GitHub Actions?',
    answer:
      "¡Sí! Puedes usar la GitHub Action oficial en tu workflow: 'uses: moisesvalero/agentchecker@main' o ejecutar 'npx agentchecker --check-only --local-only'. Saldrá con código 1 si detecta reglas contradictorias en el PR.",
  },
  {
    question: '¿Qué archivos de agentes IA soporta agentchecker?',
    answer:
      'agentchecker soporta AGENTS.md (compartido), CLAUDE.md y .claude/rules/*.md (Claude Code), .cursor/rules/*.mdc (Cursor), .github/copilot-instructions.md (GitHub Copilot), .codex/config.toml (Codex), .gemini/gemini.md (Antigravity), .opencode.json (OpenCode), .windsurfrules (Windsurf), .clinerules (Cline/Roo) y .aider.conf.yml (Aider). También lee configuraciones globales en ~/.claude/, ~/.cursor/rules/, ~/.codex/ y ~/.config/opencode/.',
  },
  {
    question:
      '¿Puede agentchecker crear symlinks a AGENTS.md o auditar el package.json?',
    answer:
      "¡Sí! Ejecuta 'npx agentchecker --symlink' para reemplazar reglas propietarias con enlaces simbólicos hacia AGENTS.md. Ejecuta 'npx agentchecker --audit-deps' para comprobar si las reglas coinciden con las dependencias instaladas en tu package.json.",
  },
  {
    question: '¿Qué contradicciones detecta agentchecker?',
    answer:
      'agentchecker detecta contradicciones en 7 categorías: gestor de paquetes (pnpm vs npm vs yarn vs bun), linter (oxlint vs eslint vs biome), formateador (prettier vs biome vs dprint), test runner (vitest vs jest vs playwright vs cypress), idioma de respuesta (español vs inglés), entorno shell (WSL2 vs Windows vs macOS) y ejecutor de paquetes (npx vs pnpm dlx vs bunx). Además, ignora de forma inteligente reglas negadas (ej. "nunca uses npm").',
  },
  {
    question: '¿agentchecker modifica archivos globales de herramientas IA?',
    answer:
      'No. agentchecker lee archivos globales (como ~/.claude/CLAUDE.md o ~/.cursor/rules/) para detectar contradicciones, pero nunca los modifica. Solo actualiza archivos locales del proyecto. Si no hay configuración local, puede crear un AGENTS.md con los valores elegidos.',
  },
  {
    question: '¿agentchecker es gratuito?',
    answer:
      'Sí, agentchecker es completamente gratuito y de código abierto bajo licencia MIT.',
  },
];

export function faqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${canonicalUrl}#software`,
    name: siteName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Linux, macOS, Windows',
    description:
      'A zero-install CLI tool that scans and fixes contradictions between AI agent instruction files such as AGENTS.md, CLAUDE.md, Cursor rules, GitHub Copilot instructions, and other AI coding assistant configurations.',
    url: canonicalUrl,
    downloadUrl: npmUrl,
    softwareVersion: PKG_VERSION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
      sameAs: [authorUrl, githubUrl, npmUrl],
    },
    isAccessibleForFree: true,
    license: licenseUrl,
    codeRepository: githubUrl,
    keywords: [
      'AI agents',
      'AGENTS.md',
      'CLAUDE.md',
      'Cursor rules',
      'Copilot instructions',
      'CLI',
      'developer tools',
      'AI coding tools',
    ],
  };
}

export function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to fix contradictions between AI agent instruction files',
    description:
      'Use agentchecker to detect and fix conflicting settings between AGENTS.md, CLAUDE.md, Cursor rules, and other AI coding tool configuration files.',
    totalTime: 'PT2M',
    url: canonicalUrl,
    tool: {
      '@type': 'HowToTool',
      name: 'agentchecker CLI',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Open a terminal in your project root',
        text: 'Navigate to the root directory of your project where your AI agent instruction files are located.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Run agentchecker',
        text: "Execute 'npx agentchecker' — no installation needed. agentchecker will scan all AI agent config files in your project and in your global tool configurations.",
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Review detected contradictions',
        text: 'agentchecker displays a report of all contradictions found, grouped by category: package manager, linter, formatter, test runner, shell environment, and package runner.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Choose the correct value',
        text: 'For each contradiction, select which value is correct for your project. agentchecker recommends the most common value found across your files.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Apply fixes automatically',
        text: 'agentchecker updates all local project files with your chosen values. Global configuration files (like ~/.claude/CLAUDE.md) are never modified.',
      },
    ],
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonicalUrl}#website`,
    name: siteName,
    url: canonicalUrl,
    description:
      'CLI tool to fix contradictions between AI agent instruction files',
    inLanguage: ['en', 'es'],
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
  };
}

export function webPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: seoEn.title,
    description: seoEn.description,
    inLanguage: ['en', 'es'],
    isPartOf: { '@id': `${canonicalUrl}#website` },
    about: { '@id': `${canonicalUrl}#software` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  };
}
