import fs from 'node:fs';
import path from 'node:path';
import type { AgentFile } from '../types.js';
import { createSymlinksToShared } from './symlink-fixes.js';

export function unifyAgentFiles(
  files: AgentFile[],
  projectDir: string,
): {
  unifiedAgentsMd: boolean;
  mergedFiles: string[];
  symlinks: { targetPath: string; symlinkCreated: boolean; error?: string }[];
} {
  const sharedPath = path.join(projectDir, 'AGENTS.md');
  const localProprietary = files.filter((f) => f.kind !== 'shared' && f.kind !== 'global');
  const mergedFiles: string[] = [];

  let agentsContent = '';
  if (fs.existsSync(sharedPath)) {
    agentsContent = fs.readFileSync(sharedPath, 'utf8').trimEnd();
  } else {
    agentsContent = `# Agent Instructions (AGENTS.md)

Shared rules for all AI coding assistants (Cursor, Claude, Copilot, Windsurf, Cline, Aider).
`;
  }

  // Fusionar secciones relevantes de los archivos propietarios
  for (const file of localProprietary) {
    mergedFiles.push(file.relativePath);
    const content = file.content.trim();
    if (!content) continue;

    // Si el contenido ya está incluido en AGENTS.md, no lo duplicamos
    if (!agentsContent.includes(content)) {
      agentsContent += `\n\n## Consolidated from ${file.relativePath}\n\n${content}`;
    }
  }

  fs.writeFileSync(sharedPath, agentsContent + '\n', 'utf8');

  // Convertir los archivos propietarios en symlinks hacia AGENTS.md
  const symlinks = createSymlinksToShared(localProprietary, projectDir);

  return {
    unifiedAgentsMd: true,
    mergedFiles,
    symlinks,
  };
}
