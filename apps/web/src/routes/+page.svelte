<script lang="ts">
  import { onMount } from 'svelte';
  import {
    PKG_VERSION,
    faqsEn,
    faqsEs,
    githubUrl,
    licenseUrl,
    npmUrl,
    seoEn,
    seoEs,
  } from '$lib/site';

  const installCommand = 'npx agentchecker';
  const pkgVersion = PKG_VERSION;
  const ciDocsUrl =
    'https://github.com/moisesvalero/agentchecker#2-cicd-pipeline-github-actions';
  const donateUrl =
    'https://www.paypal.com/donate/?business=moi6@outlook.com&no_recurring=0&item_name=Agentchecker&currency_code=USD';

  let copied = $state(false);
  let copyStatus = $state<'idle' | 'success' | 'error'>('idle');
  let lang = $state<'en' | 'es'>('en');

  const translations = {
    en: {
      nav: { docs: 'Docs', star: 'Star' },
      langToggle: 'ES',
      status: `v${pkgVersion} on npm`,
      terminalSkip: 'Skip demo',
      heroSubtitle:
        'Scans AGENTS.md, CLAUDE.md, Cursor rules, and Copilot instructions in one command. Surfaces package manager, linter, language, and formatter conflicts in under 2 seconds.',
      cta: { github: 'VIEW ON GITHUB', docs: 'DOCUMENTATION' },
      install: 'QUICK INSTALL',
      copyLabel: 'Copy install command',
      copyOk: 'Copied to clipboard',
      copyFail: 'Copy failed. Select the command manually.',
      specs: {
        agentsTitle: 'Scanned agent paths',
        ciTitle: 'Official GitHub Action & CI',
        ciHint: 'Fails the workflow when project rules disagree:',
        ciDocs: 'GitHub Action in README',
        ciSnippet: 'uses: moisesvalero/agentchecker@main',
        paths: [
          'AGENTS.md · npx agentchecker --unify',
          'CLAUDE.md · .claude/CLAUDE.md',
          '.cursor/rules/*.mdc · .cursorrules',
          '.github/copilot-instructions.md',
          '.windsurfrules · .clinerules · .roo/rules',
          'Codex · OpenCode · Aider · Antigravity',
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: faqsEn,
      },
      footer: {
        copy: '© 2026 AGENTCHECKER // MADE BY',
        docs: 'Docs',
        npm: `v${pkgVersion}`,
        license: 'MIT License',
        support: 'Support',
      },
    },
    es: {
      nav: { docs: 'Docs', star: 'Estrella' },
      langToggle: 'EN',
      status: `v${pkgVersion} en npm`,
      terminalSkip: 'Saltar demo',
      heroSubtitle:
        'Escanea AGENTS.md, CLAUDE.md, reglas de Cursor e instrucciones de Copilot en un comando. Detecta conflictos de gestor, linter, idioma y formateador en menos de 2 segundos.',
      cta: { github: 'VER EN GITHUB', docs: 'DOCUMENTACIÓN' },
      install: 'INSTALACIÓN RÁPIDA',
      copyLabel: 'Copiar comando de instalación',
      copyOk: 'Copiado al portapapeles',
      copyFail: 'No se pudo copiar. Selecciona el comando manualmente.',
      specs: {
        agentsTitle: 'Rutas de agentes escaneadas',
        ciTitle: 'GitHub Action Oficial & CI',
        ciHint: 'Falla el workflow si las reglas del proyecto no coinciden:',
        ciDocs: 'Configuración de Action en README',
        ciSnippet: 'uses: moisesvalero/agentchecker@main',
        paths: [
          'AGENTS.md · npx agentchecker --unify',
          'CLAUDE.md · .claude/CLAUDE.md',
          '.cursor/rules/*.mdc · .cursorrules',
          '.github/copilot-instructions.md',
          '.windsurfrules · .clinerules · .roo/rules',
          'Codex · OpenCode · Aider · Antigravity',
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: faqsEs,
      },
      footer: {
        copy: '© 2026 AGENTCHECKER // HECHO POR',
        docs: 'Docs',
        npm: `v${pkgVersion}`,
        license: 'Licencia MIT',
        support: 'Apoyar',
      },
    },
  } as const;

  let t = $derived(translations[lang]);

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.title = lang === 'es' ? seoEs.title : seoEn.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        lang === 'es' ? seoEs.description : seoEn.description,
      );
    }
  });

  function toggleLang() {
    lang = lang === 'en' ? 'es' : 'en';
  }

  async function copyInstall() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('clipboard unavailable');
      }
      await navigator.clipboard.writeText(installCommand);
      copied = true;
      copyStatus = 'success';
      setTimeout(() => {
        copied = false;
        copyStatus = 'idle';
      }, 2500);
    } catch {
      copied = false;
      copyStatus = 'error';
      setTimeout(() => {
        copyStatus = 'idle';
      }, 3500);
    }
  }

  const TERMINAL_STEP_COUNT = 8;
  const TERMINAL_SEEN_KEY = 'agentchecker-terminal-seen';
  const TERMINAL_DELAYS = [0, 140, 260, 380, 500, 620, 740, 860];
  let terminalStep = $state(TERMINAL_STEP_COUNT);
  let terminalDone = $derived(terminalStep >= TERMINAL_STEP_COUNT);
  let terminalAnimating = $state(false);
  let terminalTimers: ReturnType<typeof setTimeout>[] = [];

  function finishTerminalAnimation() {
    terminalTimers.forEach(clearTimeout);
    terminalTimers = [];
    terminalStep = TERMINAL_STEP_COUNT;
    terminalAnimating = false;
    try {
      sessionStorage.setItem(TERMINAL_SEEN_KEY, '1');
    } catch {
      /* private mode */
    }
  }

  function skipTerminalDemo() {
    finishTerminalAnimation();
  }

  onMount(() => {
    let mouseRaf = 0;
    let lastX = 0;
    let lastY = 0;

    const applyMouse = () => {
      mouseRaf = 0;
      document.documentElement.style.setProperty('--mouse-x', `${lastX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${lastY}px`);
    };

    const updateMouse = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!mouseRaf) {
        mouseRaf = requestAnimationFrame(applyMouse);
      }
    };

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let seenBefore = false;
    try {
      seenBefore = sessionStorage.getItem(TERMINAL_SEEN_KEY) === '1';
    } catch {
      seenBefore = false;
    }
    const shouldAnimate = !reducedMotion && !seenBefore;

    if (!reducedMotion) {
      window.addEventListener('mousemove', updateMouse, { passive: true });
    }

    if (shouldAnimate) {
      terminalAnimating = true;
      terminalStep = 0;
      TERMINAL_DELAYS.forEach((delay, index) => {
        terminalTimers.push(
          setTimeout(() => {
            terminalStep = index + 1;
            if (index + 1 === TERMINAL_STEP_COUNT) {
              finishTerminalAnimation();
            }
          }, delay),
        );
      });
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && terminalAnimating) {
        skipTerminalDemo();
      }
    };
    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('keydown', onKeydown);
      if (mouseRaf) {
        cancelAnimationFrame(mouseRaf);
      }
      terminalTimers.forEach(clearTimeout);
      terminalTimers = [];
    };
  });
</script>

<div class="landing">
  <div class="mouse-glow" aria-hidden="true"></div>
  <div class="crt-vignette" aria-hidden="true"></div>
  <header class="header">
    <a class="logo" href="/">
      <span class="logo-prompt">&gt;_</span>
      <span class="logo-text">agentchecker</span>
      <span class="logo-dot">.</span>
    </a>
    <nav class="nav" aria-label="Primary">
      <a
        class="active"
        href="https://github.com/moisesvalero/agentchecker#readme"
        >{t.nav.docs}</a
      >
      <a class="star-link" href={githubUrl} target="_blank" rel="noreferrer">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span>{t.nav.star}</span>
      </a>
    </nav>
    <div class="header-spacer">
      <button
        class="lang-toggle"
        onclick={toggleLang}
        aria-label="Switch language">{t.langToggle}</button
      >
    </div>
  </header>

  <main>
    <section class="hero">
      <a class="status-badge" href={npmUrl} target="_blank" rel="noreferrer">
        {t.status}
      </a>
      <h1 class="hero-title">AGENTCHECKER<span>.</span></h1>
      <p class="hero-subtitle">{t.heroSubtitle}</p>

      <div class="terminal" aria-label="Agentchecker CLI preview">
        <div class="terminal-bar">
          <div class="traffic" aria-hidden="true">
            <span class="dot-red"></span>
            <span class="dot-yellow"></span>
            <span class="dot-green"></span>
          </div>
          <span class="terminal-title">agentchecker — ~/my-app</span>
          {#if terminalAnimating && !terminalDone}
            <button
              type="button"
              class="terminal-skip"
              onclick={skipTerminalDemo}
            >
              {t.terminalSkip}
            </button>
          {/if}
        </div>
        <div
          class="terminal-body"
          class:terminal-body--done={terminalDone}
          aria-live="polite"
        >
          {#if terminalStep >= 1}
            <p class="command t-line" style="--d:0">
              <span>$</span> npx agentchecker
            </p>
          {/if}
          {#if terminalStep >= 2}
            <p class="brand t-line" style="--d:1">agentchecker</p>
          {/if}
          {#if terminalStep >= 3}
            <p class="dim t-line found-line" style="--d:2">
              Found: <span class="ok">✓</span>
              <span class="found-files"
                >.cursor/rules/global.mdc · AGENTS.md · CLAUDE.md</span
              >
            </p>
          {/if}
          {#if terminalStep >= 4}
            <p class="warn t-line" style="--d:3">⚠ 2 contradictions found:</p>
          {/if}
          {#if terminalStep >= 5}
            <div class="terminal-grid t-line" style="--d:4">
              <div>
                <p class="category">Package manager</p>
                <p class="dim">.cursor/... → <span class="val">npm</span></p>
                <p class="dim">CLAUDE.md → <span class="val">npm</span></p>
                <p class="dim">AGENTS.md → <span class="val">pnpm</span></p>
                <p class="rec">→ pnpm</p>
              </div>
              <div>
                <p class="category">Linter</p>
                <p class="dim">.cursor/... → <span class="val">eslint</span></p>
                <p class="dim">CLAUDE.md → <span class="val">eslint</span></p>
                <p class="dim">AGENTS.md → <span class="val">oxlint</span></p>
                <p class="rec">→ oxlint</p>
              </div>
            </div>
          {/if}
          {#if terminalStep >= 6}
            <p class="prompt t-line" style="--d:5">
              ◇ Fix? <span class="accent">Yes</span> · pnpm · oxlint
            </p>
          {/if}
          {#if terminalStep >= 7}
            <div class="diff-block t-line" style="--d:6">
              <p class="category">CLAUDE.md</p>
              <p class="diff-minus">- Run `npm install` before starting.</p>
              <p class="diff-plus">+ Run `pnpm install` before starting.</p>
            </div>
          {/if}
          {#if terminalStep >= 8}
            <p class="success t-line" style="--d:7">
              ✓ Fixed 2 files. All your agents agree.
              {#if terminalDone}<span class="cursor" aria-hidden="true"
                ></span>{/if}
            </p>
          {/if}
        </div>
      </div>

      <div class="cta-row">
        <a
          class="btn btn-primary"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t.cta.github}
        </a>
        <a
          class="btn btn-secondary"
          href="https://github.com/moisesvalero/agentchecker#readme"
          target="_blank"
          rel="noreferrer"
        >
          {t.cta.docs}
        </a>
      </div>

      <div class="install-bar">
        <span class="install-label">{t.install}</span>
        <code><span>$</span> {installCommand}</code>
        <button
          class="copy-btn"
          type="button"
          onclick={copyInstall}
          aria-label={t.copyLabel}
        >
          {#if copied}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="9"
                y="3"
                width="9"
                height="13"
                rx="1"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M6 8H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </button>
      </div>
      {#if copyStatus !== 'idle'}
        <p
          class="copy-feedback"
          class:copy-feedback--error={copyStatus === 'error'}
          role="status"
        >
          {copyStatus === 'success' ? t.copyOk : t.copyFail}
        </p>
      {/if}
    </section>

    <section class="specs" id="specs" aria-labelledby="specs-agents-title">
      <div class="specs-panel">
        <h2 id="specs-agents-title" class="specs-title">
          {t.specs.agentsTitle}
        </h2>
        <ul class="specs-list">
          {#each t.specs.paths as path}
            <li><span class="specs-ok">✓</span> {path}</li>
          {/each}
        </ul>
      </div>
      <div class="specs-panel">
        <h2 class="specs-title">{t.specs.ciTitle}</h2>
        <p class="specs-hint">{t.specs.ciHint}</p>
        <pre class="specs-code"><code
            ><span class="specs-prompt">$</span> {t.specs.ciSnippet}</code
          ></pre>
        <a class="specs-docs" href={ciDocsUrl} target="_blank" rel="noreferrer">
          {t.specs.ciDocs}
        </a>
      </div>
    </section>

    <section class="faq" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" class="faq-title">{t.faq.title}</h2>
      <div class="faq-list">
        {#each t.faq.items as item, index (item.question)}
          <details class="faq-item" open={index === 0}>
            <summary class="faq-question">{item.question}</summary>
            <p class="faq-answer">{item.answer}</p>
          </details>
        {/each}
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-left">
      <span class="footer-brand">AGENTCHECKER</span>
      <span class="footer-copy">
        {t.footer.copy}
        <a
          class="portfolio-link"
          href="https://moisesvalero.es"
          target="_blank"
          rel="noreferrer">MOISÉS VALERO</a
        >
      </span>
      <span class="footer-license">
        <a
          class="portfolio-link"
          href={licenseUrl}
          target="_blank"
          rel="noreferrer">{t.footer.license}</a
        >
      </span>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <a
        class="footer-github"
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub Repository"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      </a>
      <a href="https://github.com/moisesvalero/agentchecker#readme"
        >{t.footer.docs}</a
      >
      <a href={npmUrl}>{t.footer.npm}</a>
      <a href="/privacy/">Privacy</a>
      <a class="support-link" href={donateUrl} target="_blank" rel="noreferrer">
        <span class="support-heart" aria-hidden="true">♥</span>
        {t.footer.support}
      </a>
    </nav>
  </footer>
</div>

<style>
  .landing {
    position: relative;
    width: min(100%, 1280px);
    min-height: 100vh;
    min-height: 100dvh;
    margin: 0 auto;
    padding: max(20px, env(safe-area-inset-top, 0px))
      max(24px, env(safe-area-inset-right, 0px))
      max(44px, env(safe-area-inset-bottom, 0px))
      max(24px, env(safe-area-inset-left, 0px));
    overflow-x: clip;
    background-color: transparent;
  }

  .mouse-glow {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 30%),
      rgba(0, 255, 65, 0.07),
      transparent 75%
    );
  }

  .crt-vignette {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(
      circle at center,
      transparent 65%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: start;
    min-height: 36px;
  }

  .logo,
  .nav a,
  .footer-github,
  .status-badge,
  .terminal,
  .btn,
  .install-bar,
  .specs,
  .footer {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: -0.01em;
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .logo:hover {
    transform: translateY(-1px);
  }

  .logo:hover .logo-prompt {
    color: #ffffff;
    text-shadow: var(--glow-strong);
  }

  .logo-prompt {
    color: var(--primary);
    text-shadow: var(--glow);
    font-weight: 800;
  }

  .logo-text {
    text-transform: lowercase;
  }

  .logo-dot {
    color: var(--primary);
    text-shadow: var(--glow-strong);
    font-weight: 900;
  }

  .nav {
    display: flex;
    gap: clamp(28px, 5vw, 64px);
    justify-content: center;
  }

  .nav a,
  .footer-nav a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 8px 4px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: color 0.16s ease;
  }

  .nav a:hover,
  .nav a.active,
  .footer-nav a:hover {
    color: var(--primary);
  }

  .nav a.active {
    color: var(--primary);
  }

  .header-spacer {
    justify-self: end;
    display: flex;
    align-items: center;
  }

  .lang-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    background: transparent;
    border: 1px solid rgba(0, 255, 65, 0.25);
    color: rgba(0, 255, 65, 0.75);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    padding: 8px 12px;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease,
      background 0.2s ease;
  }

  .lang-toggle:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: rgba(0, 255, 65, 0.06);
  }

  .footer-github {
    display: inline-flex;
    align-items: center;
    transition:
      transform 0.2s cubic-bezier(0.25, 1, 0.5, 1),
      color 0.2s ease;
  }

  .footer-github:hover {
    transform: translateY(-2px) scale(1.08);
    color: var(--primary);
  }

  .hero {
    padding: 32px 0 0;
    text-align: center;
  }

  .status-badge {
    display: inline-flex;
    padding: 9px 15px;
    margin-bottom: 16px;
    color: var(--primary);
    background: rgba(0, 255, 65, 0.06);
    border: 1px solid rgba(0, 255, 65, 0.34);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    box-shadow: var(--glow);
    text-decoration: none;
    transition:
      border-color 0.16s ease,
      color 0.16s ease;
  }

  .status-badge:hover {
    border-color: var(--primary);
    color: #ffffff;
  }

  .hero-title {
    margin: 0;
    color: #ffffff;
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    text-wrap: balance;
    text-shadow: 0 0 24px rgba(0, 255, 65, 0.2);
  }

  .hero-title span {
    color: var(--primary);
    text-shadow: var(--glow-strong);
  }

  .hero-subtitle {
    max-width: 580px;
    margin: 10px auto 18px;
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.55;
    text-wrap: pretty;
  }

  .terminal {
    width: min(640px, 100%);
    min-width: 0;
    margin: 0 auto 20px;
    overflow: hidden;
    color: var(--text);
    text-align: left;
    background: var(--terminal-bg);
    border: 1px solid rgba(0, 255, 65, 0.3);
    border-radius: 0;
    box-shadow: 0 0 0 1px rgba(0, 255, 65, 0.12);
    position: relative;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  .terminal:hover {
    border-color: rgba(0, 255, 65, 0.45);
    box-shadow: 0 0 0 1px rgba(0, 255, 65, 0.22);
  }

  .terminal-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;
    background: linear-gradient(#181818, #121212);
    border-bottom: 1px solid var(--border);
  }

  .traffic {
    position: absolute;
    left: 14px;
    display: flex;
    gap: 6px;
  }

  .traffic span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.65;
    transition:
      filter 0.16s ease,
      opacity 0.16s ease;
  }

  .terminal:hover .traffic span {
    opacity: 0.9;
    filter: brightness(1.2) drop-shadow(0 0 3px currentColor);
  }

  .dot-red {
    background: #ff6b6b;
  }

  .dot-yellow {
    background: #f5c542;
  }

  .dot-green {
    background: #00ff41;
  }

  .terminal-title {
    color: var(--terminal-bar-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .terminal-skip {
    position: absolute;
    right: 10px;
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 4px 10px;
    color: var(--terminal-bar-muted);
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition:
      border-color 0.16s ease,
      color 0.16s ease;
  }

  .terminal-skip:hover {
    border-color: rgba(0, 255, 65, 0.4);
    color: var(--primary);
  }

  .terminal-body {
    position: relative;
    z-index: 1;
    min-width: 0;
    min-height: 168px;
    max-height: 220px;
    padding: 10px 14px 8px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.38;
    overflow-wrap: anywhere;
  }

  .found-line {
    overflow-wrap: anywhere;
  }

  .found-files {
    display: inline;
  }

  .terminal-body--done {
    min-height: 0;
    max-height: none;
  }

  .terminal-body p {
    margin: 0 0 2px;
  }

  .t-line {
    animation: term-in 0.28s ease both;
    animation-delay: calc(var(--d, 0) * 30ms);
  }

  @keyframes term-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .command {
    margin-bottom: 4px;
    color: var(--text);
  }

  .command span,
  .install-bar code span {
    color: var(--primary);
  }

  .brand {
    margin-bottom: 4px;
    color: #67e8f9;
    font-weight: 700;
  }

  .dim {
    color: var(--terminal-dim);
  }

  .dim .ok {
    color: var(--primary);
  }

  .warn {
    margin: 6px 0 4px;
    color: #f5c542;
  }

  .category {
    margin: 0 0 2px;
    color: #ffffff;
    font-weight: 800;
    font-size: 10px;
  }

  .val {
    color: #67e8f9;
  }

  .rec {
    margin: 0;
    color: var(--primary);
    font-size: 10px;
  }

  .terminal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
    margin: 4px 0 6px;
    padding: 6px 0;
    border-top: 1px solid #151515;
    border-bottom: 1px solid #151515;
  }

  .terminal-grid p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .prompt {
    margin: 4px 0;
    color: #ffffff;
  }

  .prompt .accent {
    color: var(--primary);
  }

  .diff-block {
    margin: 4px 0;
  }

  .diff-block .category {
    margin-bottom: 1px;
  }

  .diff-minus {
    color: #ff6b6b;
    font-size: 10px;
  }

  .diff-plus {
    color: var(--primary);
    font-size: 10px;
  }

  .success {
    margin-top: 6px;
    color: var(--primary);
    text-shadow: var(--glow);
  }

  .cursor {
    display: inline-block;
    width: 7px;
    height: 12px;
    margin-left: 2px;
    background: var(--primary);
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  .cta-row {
    display: flex;
    justify-content: center;
    gap: 22px;
    margin-bottom: 20px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 248px;
    min-height: 46px;
    padding: 14px 24px;
    border-radius: 0;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    transition:
      background 0.16s ease,
      border-color 0.16s ease,
      color 0.16s ease;
  }

  .btn-primary {
    color: #000000;
    background: var(--primary);
    border: 1px solid var(--primary);
  }

  .btn-primary:hover {
    background-color: #33ff66;
    box-shadow: var(--glow);
  }

  .btn-secondary {
    color: var(--text);
    background: transparent;
    border: 1px solid transparent;
  }

  .btn-secondary:hover {
    color: var(--primary);
  }

  .install-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: min(720px, 100%);
    min-height: 52px;
    margin: 0 auto 28px;
    padding: 0 18px;
    color: var(--text);
    background: #050505;
    border: 1px solid var(--primary);
  }

  .install-label {
    position: absolute;
    top: -9px;
    left: 20px;
    padding: 0 8px;
    color: var(--text-muted);
    background: #0a0a0a;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.28em;
  }

  .install-bar code {
    flex: 1;
    overflow-x: auto;
    color: var(--text);
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }

  .copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: var(--primary);
    background: transparent;
    border: 0;
    transition:
      transform 0.16s ease,
      color 0.16s ease;
  }

  .copy-btn:hover {
    color: #ffffff;
    transform: scale(1.1);
  }

  .copy-btn:active {
    transform: scale(0.95);
  }

  .copy-feedback {
    width: min(720px, 100%);
    margin: 8px auto 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--primary);
    text-align: center;
  }

  .copy-feedback--error {
    color: #ff8a8a;
  }

  .specs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    width: min(720px, 100%);
    margin: 48px auto 0;
    text-align: left;
  }

  .specs-panel {
    padding: 16px 18px;
    background: rgba(5, 5, 5, 0.92);
    border: 1px solid var(--border);
  }

  .specs-title {
    margin: 0 0 12px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--primary);
  }

  .specs-hint {
    margin: 0 0 10px;
    font-size: 11px;
    line-height: 1.45;
    color: var(--text-muted);
  }

  .specs-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .specs-list li {
    margin: 0 0 5px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--text);
    overflow-wrap: anywhere;
  }

  .specs-ok {
    color: var(--primary);
  }

  .specs-code {
    margin: 0;
    padding: 10px 12px;
    overflow-x: auto;
    font-size: 11px;
    line-height: 1.45;
    color: var(--text);
    background: #0a0a0a;
    border: 1px solid rgba(0, 255, 65, 0.15);
  }

  .specs-code code {
    font-family: inherit;
  }

  .specs-prompt {
    color: var(--primary);
  }

  .specs-docs {
    display: inline-block;
    margin-top: 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.16s ease;
  }

  .specs-docs:hover {
    color: #ffffff;
  }

  .faq {
    width: min(720px, 100%);
    margin: 56px auto 0;
    text-align: left;
  }

  .faq-title {
    margin: 0 0 16px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--primary);
    text-align: center;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .faq-item {
    padding: 0;
    background: rgba(5, 5, 5, 0.92);
    border: 1px solid var(--border);
  }

  .faq-question {
    padding: 14px 16px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.45;
    cursor: pointer;
    list-style: none;
  }

  .faq-question::-webkit-details-marker {
    display: none;
  }

  .faq-question::before {
    content: '› ';
    color: var(--primary);
    font-weight: 900;
  }

  .faq-item[open] .faq-question::before {
    content: '⌄ ';
  }

  .faq-answer {
    margin: 0;
    padding: 0 16px 14px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-top: 126px;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .footer-brand {
    color: var(--primary);
    font-size: 12px;
    font-weight: 800;
  }

  .footer-copy {
    color: var(--text-dim);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
  }

  .footer-license {
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .footer-license .portfolio-link {
    text-decoration: underline;
  }

  .portfolio-link {
    color: var(--text-muted);
    text-decoration: underline;
    transition: color 0.16s ease;
  }

  .portfolio-link:hover {
    color: var(--primary);
    text-shadow: var(--glow);
  }

  .star-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .star-link:hover {
    color: var(--primary);
    text-shadow: var(--glow);
  }

  .support-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: color 0.16s ease;
  }

  .support-heart {
    color: var(--primary);
    font-size: 11px;
    line-height: 1;
  }

  .support-link:hover {
    color: var(--primary);
  }

  .support-link:hover .support-heart {
    text-shadow: var(--glow);
  }

  .footer-nav {
    display: flex;
    gap: clamp(20px, 4vw, 44px);
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  @media (max-width: 900px) {
    .landing {
      padding-inline: max(18px, env(safe-area-inset-left, 0px))
        max(18px, env(safe-area-inset-right, 0px));
    }

    .header {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        'logo lang'
        'nav nav';
      gap: 12px 16px;
      align-items: center;
    }

    .logo {
      grid-area: logo;
      justify-self: start;
    }

    .nav {
      grid-area: nav;
      width: 100%;
      justify-content: center;
      gap: 28px;
    }

    .header-spacer {
      grid-area: lang;
      justify-self: end;
    }

    .hero {
      padding-top: 12px;
    }

    .hero-title {
      font-size: clamp(36px, 11vw, 58px);
      overflow-wrap: anywhere;
    }

    .terminal-body {
      min-height: 0;
      max-height: none;
      padding: 12px 12px 10px;
      font-size: 11px;
    }

    .terminal-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .cta-row {
      flex-direction: column;
      align-items: stretch;
      margin-bottom: 64px;
    }

    .btn {
      min-width: 0;
    }

    .specs {
      grid-template-columns: 1fr;
      margin-top: 40px;
    }

    .footer {
      align-items: flex-start;
      flex-direction: column;
      margin-top: 72px;
    }

    .footer-nav {
      justify-content: flex-start;
    }
  }

  @media (max-width: 520px) {
    .landing {
      padding-inline: max(16px, env(safe-area-inset-left, 0px))
        max(16px, env(safe-area-inset-right, 0px));
    }

    .nav {
      gap: 20px;
    }

    .status-badge {
      max-width: 100%;
      line-height: 1.45;
      text-align: center;
      font-size: 11px;
    }

    .hero-title {
      font-size: clamp(30px, 9.5vw, 44px);
    }

    .hero-subtitle {
      font-size: 14px;
      line-height: 1.55;
      padding-inline: 4px;
    }

    .terminal {
      width: 100%;
    }

    .terminal-body {
      padding: 10px;
      font-size: 10px;
      line-height: 1.45;
    }

    .found-files {
      display: block;
      margin-top: 2px;
    }

    .terminal-grid p {
      white-space: normal;
    }

    .terminal-title {
      max-width: calc(100% - 56px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 9px;
    }

    .traffic {
      left: 8px;
      gap: 5px;
    }

    .traffic span {
      width: 7px;
      height: 7px;
    }

    .terminal-skip {
      min-width: 44px;
      min-height: 44px;
      padding: 8px 12px;
    }

    .install-bar {
      align-items: stretch;
      flex-direction: column;
      padding: 20px;
    }

    .copy-btn {
      align-self: flex-end;
    }

    .install-bar code {
      font-size: 12px;
      white-space: normal;
      word-break: break-word;
    }

    .copy-btn {
      align-self: stretch;
      width: 100%;
    }
  }

  @media (max-width: 900px) and (orientation: landscape) {
    .hero {
      padding-top: 24px;
    }

    .hero-title {
      font-size: clamp(28px, 8vw, 48px);
    }

    .cta-row {
      margin-bottom: 32px;
    }

    .footer {
      margin-top: 48px;
    }
  }

  @media (pointer: coarse) {
    .terminal-skip {
      min-width: 44px;
      min-height: 44px;
    }

    .lang-toggle {
      min-width: 48px;
      min-height: 48px;
    }
  }

  @media (hover: none) {
    .logo:hover,
    .footer-github:hover {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mouse-glow {
      display: none;
    }

    .t-line {
      animation: none;
    }
  }
</style>
