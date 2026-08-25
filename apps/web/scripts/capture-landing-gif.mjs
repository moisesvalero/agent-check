#!/usr/bin/env node
/**
 * Captura la animación del terminal de la landing y genera demo-landing.gif
 * Requiere preview en http://127.0.0.1:4173 y ffmpeg en PATH.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, '..');
const repoRoot = path.join(webRoot, '../..');
const framesDir = path.join(repoRoot, '.tmp', 'landing-frames');
const outGif = path.join(repoRoot, 'demo-landing.gif');
const baseUrl = process.env.LANDING_URL ?? 'http://127.0.0.1:4173';

await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['iPhone 14 Pro'],
  defaultBrowserType: 'chromium',
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(`${baseUrl}/`);
await page.evaluate(() =>
  localStorage.removeItem('agentchecker-terminal-seen'),
);
await page.reload({ waitUntil: 'networkidle' });

const hero = page.locator('.terminal');
await hero.waitFor({ state: 'visible' });

const frameCount = 20;
const frameDelayMs = 180;
for (let i = 0; i < frameCount; i += 1) {
  const framePath = path.join(
    framesDir,
    `frame-${String(i).padStart(3, '0')}.png`,
  );
  await hero.screenshot({ path: framePath });
  await page.waitForTimeout(frameDelayMs);
}

await browser.close();

const fps = Math.round(1000 / frameDelayMs);
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-framerate',
    String(fps),
    '-i',
    path.join(framesDir, 'frame-%03d.png'),
    '-vf',
    'fps=8,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer',
    outGif,
  ],
  { stdio: 'inherit' },
);

const files = await readdir(framesDir);
console.log(`GIF: ${outGif} (${files.length} frames @ ${fps}fps)`);
