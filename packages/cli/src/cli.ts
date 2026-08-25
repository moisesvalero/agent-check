import { parseArgs } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { scanProject } from './scan/scan-project.js';
import { extractFacts } from './extract/extract-facts.js';
import { findContradictions } from './compare/find-contradictions.js';
import { applyRecommendations } from './compare/recommend-resolution.js';
import { planFixes } from './fix/plan-fixes.js';
import { applyFixes, previewFixes } from './fix/apply-fixes.js';
import { renderContradictions, renderFoundFiles } from './ui/render-report.js';
import { confirmApplyChanges, promptFixContradictions } from './ui/prompt-resolutions.js';
import { auditDependencies } from './compare/audit-deps.js';
import { createSymlinksToShared, initProjectAgents } from './fix/symlink-fixes.js';
import { unifyAgentFiles } from './fix/unify-rules.js';
import { normalizeAgentFilter } from './scan/agent-map.js';
import {
  EXIT_CONTRADICTIONS,
  EXIT_OK,
  EXIT_USAGE,
  EXIT_WRITE_ERROR,
  type AgentId,
  type CliOptions,
} from './types.js';

function parseCliOptions(argv: string[]): CliOptions {
  const { values } = parseArgs({
    args: argv,
    options: {
      'dry-run': { type: 'boolean', default: false },
      'check-only': { type: 'boolean', default: false },
      'local-only': { type: 'boolean', default: false },
      symlink: { type: 'boolean', default: false },
      init: { type: 'boolean', default: false },
      unify: { type: 'boolean', default: false },
      badge: { type: 'boolean', default: false },
      'audit-deps': { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
      verbose: { type: 'boolean', short: 'v', default: false },
      agent: { type: 'string', short: 'a', multiple: true },
      'project-dir': { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`agentchecker — fix contradictions between AI agent instruction files

Usage:
  npx agentchecker [options]

Options:
  --dry-run       Show contradictions and preview without writing
  --check-only    Exit 1 if contradictions exist (CI mode)
  --local-only    Scan only project files, skip global home configs
  --symlink       Replace tool-specific rule files with symlinks to AGENTS.md
  --init          Initialize AGENTS.md and link all agent tools
  --unify         Merge all local agent files into AGENTS.md and symlink tools
  --badge         Output markdown/HTML badge for your project README
  --audit-deps    Audit rules against installed package.json dependencies
  -y, --yes       Apply recommended fixes without prompts
  -a, --agent     Limit scan to agents: cursor, claude, copilot, shared
  --project-dir   Project directory to scan (default: cwd)
  -v, --verbose   Verbose output
  -h, --help      Show help
`);
    process.exit(EXIT_OK);
  }

  const agentsRaw = values.agent ?? [];
  const agents =
    agentsRaw.length === 0
      ? null
      : agentsRaw
          .flatMap((entry) => entry.split(','))
          .map((entry) => normalizeAgentFilter(entry.trim()))
          .filter((entry): entry is AgentId => entry !== null);

  if (agentsRaw.length > 0 && agents !== null && agents.length === 0) {
    throw new Error('Invalid --agent value. Use cursor, claude, copilot, or shared.');
  }

  return {
    cwd: values['project-dir'] ? path.resolve(values['project-dir']) : process.cwd(),
    dryRun: Boolean(values['dry-run']),
    checkOnly: Boolean(values['check-only']),
    localOnly: Boolean(values['local-only']),
    symlink: Boolean(values.symlink),
    init: Boolean(values.init),
    unify: Boolean(values.unify),
    badge: Boolean(values.badge),
    auditDeps: Boolean(values['audit-deps']),
    yes: Boolean(values.yes),
    verbose: Boolean(values.verbose),
    agents,
  };
}

export async function runCli(argv: string[]): Promise<number> {
  const started = Date.now();

  let options: CliOptions;
  try {
    options = parseCliOptions(argv);
  } catch (error) {
    console.error(pc.red(error instanceof Error ? error.message : String(error)));
    return EXIT_USAGE;
  }

  if (options.badge) {
    console.log(pc.cyan('agentchecker — README Badge:\n'));
    console.log(pc.bold('Markdown:'));
    console.log(
      '[![AI Agents Aligned](https://img.shields.io/badge/AI%20Rules-Aligned-00ff41?style=flat-square&logo=git&logoColor=white)](https://github.com/moisesvalero/agentchecker)\n',
    );
    console.log(pc.bold('HTML:'));
    console.log(
      '<a href="https://github.com/moisesvalero/agentchecker"><img src="https://img.shields.io/badge/AI%20Rules-Aligned-00ff41?style=flat-square&logo=git&logoColor=white" alt="AI Agents Aligned" /></a>\n',
    );
    return EXIT_OK;
  }

  if (options.init) {
    console.log(pc.cyan('agentchecker --init'));
    const { createdAgentsMd, symlinks } = initProjectAgents(options.cwd, true);
    if (createdAgentsMd) {
      console.log(`  ${pc.green('✓')} Created AGENTS.md with standard instructions`);
    } else {
      console.log(`  ${pc.dim('•')} AGENTS.md already exists`);
    }
    for (const res of symlinks) {
      if (res.symlinkCreated) {
        console.log(
          `  ${pc.green('✓')} Symlinked ${path.relative(options.cwd, res.targetPath)} -> AGENTS.md`,
        );
      } else {
        console.log(
          `  ${pc.red('✗')} Failed to symlink ${path.relative(options.cwd, res.targetPath)}: ${res.error}`,
        );
      }
    }
    console.log(
      pc.green(
        `\n✓ All agent configs initialized and aligned to AGENTS.md! (Done in ${((Date.now() - started) / 1000).toFixed(1)}s)`,
      ),
    );
    return EXIT_OK;
  }

  if (!options.checkOnly && !options.yes) {
    p.intro(pc.cyan('agentchecker'));
  } else {
    console.log(pc.cyan('agentchecker'));
  }

  let files;
  if (!options.checkOnly && !options.yes) {
    const spinner = p.spinner();
    spinner.start('Scanning AI agent files...');
    files = await scanProject(options.cwd, options.agents, !options.localOnly);
    spinner.stop(renderFoundFiles(files));
  } else {
    files = await scanProject(options.cwd, options.agents, !options.localOnly);
    console.log(renderFoundFiles(files));
  }

  if (options.unify) {
    console.log(pc.cyan('\nUnifying all agent files into AGENTS.md:'));
    const { mergedFiles, symlinks } = unifyAgentFiles(files, options.cwd);
    for (const file of mergedFiles) {
      console.log(`  ${pc.green('✓')} Merged rules from ${file}`);
    }
    for (const res of symlinks) {
      if (res.symlinkCreated) {
        console.log(
          `  ${pc.green('✓')} Symlinked ${path.relative(options.cwd, res.targetPath)} -> AGENTS.md`,
        );
      } else {
        console.log(
          `  ${pc.red('✗')} Failed to symlink ${path.relative(options.cwd, res.targetPath)}: ${res.error}`,
        );
      }
    }
    console.log(
      pc.green(
        `\n✓ Unified into AGENTS.md and symlinked ${symlinks.length} agent files! (Done in ${((Date.now() - started) / 1000).toFixed(1)}s)`,
      ),
    );
    return EXIT_OK;
  }

  if (files.length === 0) {
    if (!options.checkOnly && !options.yes) {
      p.outro(
        pc.yellow(
          'No AI agent instruction files found in this directory. Run npx agentchecker --init to create one.',
        ),
      );
    } else {
      console.log(pc.yellow('No AI agent instruction files found.'));
    }
    return EXIT_OK;
  }

  const globalPaths = new Set(files.filter((f) => f.kind === 'global').map((f) => f.path));
  const localFiles = files.filter((f) => f.kind !== 'global');

  const facts = extractFacts(files);

  if (options.symlink) {
    const symlinkResults = createSymlinksToShared(localFiles, options.cwd);
    console.log(pc.cyan('\nSymlinking tool-specific rules to AGENTS.md:'));
    for (const res of symlinkResults) {
      if (res.symlinkCreated) {
        console.log(
          `  ${pc.green('✓')} Symlinked ${path.relative(options.cwd, res.targetPath)} -> AGENTS.md`,
        );
      } else {
        console.log(
          `  ${pc.red('✗')} Failed to symlink ${path.relative(options.cwd, res.targetPath)}: ${res.error}`,
        );
      }
    }
    return EXIT_OK;
  }

  const mismatches = auditDependencies(facts, options.cwd);
  if (mismatches.length > 0) {
    console.log(pc.yellow('\nRule vs. Workspace Dependency Mismatches:'));
    for (const m of mismatches) {
      console.log(`  ${pc.yellow('⚠')} ${m.message}`);
    }
  }

  let contradictions = applyRecommendations(findContradictions(facts), facts);

  if (contradictions.length > 0) {
    console.log('\n' + renderContradictions(contradictions, globalPaths));
  }

  if (contradictions.length === 0) {
    if (!options.checkOnly && !options.yes) {
      p.outro(
        pc.green(
          `✓ No contradictions found. All your agents agree! (Done in ${((Date.now() - started) / 1000).toFixed(1)}s)`,
        ),
      );
    } else {
      console.log(pc.green('✓ No contradictions found. All your agents agree!'));
    }
    return EXIT_OK;
  }

  if (options.checkOnly) {
    return EXIT_CONTRADICTIONS;
  }

  // Solo los archivos locales son modificables; los globales son de solo lectura
  const fileContents = new Map(localFiles.map((file) => [file.path, file.content]));

  let resolved = contradictions.map((contradiction) => ({
    ...contradiction,
    chosen: contradiction.recommendation,
  }));

  if (!options.yes && !options.dryRun) {
    const prompted = await promptFixContradictions(contradictions);
    if (!prompted) {
      p.outro(pc.yellow('No changes applied.'));
      return EXIT_CONTRADICTIONS;
    }
    resolved = prompted;
  }

  let changes = planFixes(resolved, fileContents);

  // Si no hay archivos locales que fixear, ofrecer crear AGENTS.md con las decisiones tomadas
  if (changes.length === 0 && localFiles.length === 0 && !options.dryRun) {
    const agentsMdPath = path.join(options.cwd, 'AGENTS.md');
    const lines = [
      '# Agent Instructions',
      '',
      '<!-- Generado por agentchecker para alinear configuraciones de herramientas IA -->',
      '',
      ...resolved.map((r) => `- Use **${r.chosen}** for ${r.category.replace('-', ' ')}.`),
      '',
    ];

    if (!options.yes) {
      const create = await p.confirm({
        message: `No local config files found. Create ${pc.cyan('AGENTS.md')} with your choices?`,
        initialValue: true,
      });
      if (p.isCancel(create) || !create) {
        p.outro(pc.yellow('No changes applied.'));
        return EXIT_CONTRADICTIONS;
      }
    }

    await writeFile(agentsMdPath, lines.join('\n'), 'utf8');
    const message = `✓ Created AGENTS.md with resolved settings. Done in ${((Date.now() - started) / 1000).toFixed(1)}s`;
    if (!options.yes) {
      p.outro(pc.green(message));
    } else {
      console.log(pc.green(message));
    }
    return EXIT_OK;
  }

  if (changes.length === 0) {
    p.outro(pc.yellow('No safe automatic fixes found.'));
    return EXIT_CONTRADICTIONS;
  }

  const preview = previewFixes(changes);
  console.log('\n' + preview);

  if (options.dryRun) {
    const message = 'Dry run complete. No files were changed.';
    if (!options.yes) {
      p.outro(pc.dim(message));
    } else {
      console.log(pc.dim(message));
    }
    return EXIT_OK;
  }

  if (!options.yes) {
    const confirmed = await confirmApplyChanges();
    if (!confirmed) {
      p.outro(pc.yellow('No changes applied.'));
      return EXIT_CONTRADICTIONS;
    }
  }

  try {
    const updated = await applyFixes(changes);
    const message = `✓ Fixed ${updated.length} file${updated.length === 1 ? '' : 's'}. All your agents agree.\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s`;
    if (!options.yes) {
      p.outro(pc.green(message));
    } else {
      console.log(pc.green(message));
    }
    return EXIT_OK;
  } catch (error) {
    console.error(pc.red(error instanceof Error ? error.message : String(error)));
    return EXIT_WRITE_ERROR;
  }
}

const isMain =
  process.argv[1] &&
  (path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url)) ||
    process.argv[1].endsWith('agentchecker.js') ||
    process.argv[1].endsWith('agentchecker'));

if (isMain) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exit(code);
  });
}
