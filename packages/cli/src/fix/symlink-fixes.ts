import fs from 'node:fs';
import path from 'node:path';
import type { AgentFile } from '../types.js';

export function createSymlinksToShared(
  files: AgentFile[],
  projectDir: string,
): { targetPath: string; symlinkCreated: boolean; error?: string }[] {
  const results: { targetPath: string; symlinkCreated: boolean; error?: string }[] = [];
  const sharedPath = path.join(projectDir, 'AGENTS.md');

  // Ensure AGENTS.md exists
  if (!fs.existsSync(sharedPath)) {
    fs.writeFileSync(
      sharedPath,
      '# AGENTS.md\n\nShared AI instructions for this repository.\n',
      'utf8',
    );
  }

  for (const agentFile of files) {
    if (agentFile.kind === 'shared' || agentFile.kind === 'global') {
      continue;
    }

    const fullPath = agentFile.path;
    const fileDir = path.dirname(fullPath);
    const relToShared = path.relative(fileDir, sharedPath);

    try {
      if (fs.existsSync(fullPath) || fs.lstatSync(fullPath).isSymbolicLink()) {
        fs.unlinkSync(fullPath);
      }
      fs.symlinkSync(relToShared, fullPath, 'file');
      results.push({ targetPath: fullPath, symlinkCreated: true });
    } catch (err: any) {
      results.push({
        targetPath: fullPath,
        symlinkCreated: false,
        error: err?.message || String(err),
      });
    }
  }

  return results;
}
