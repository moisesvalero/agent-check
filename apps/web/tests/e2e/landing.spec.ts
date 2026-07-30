import { expect, test } from '@playwright/test';

test('landing muestra comando de instalación y CTA principal', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByText('npx agentchecker').first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: /VIEW ON GITHUB|VER EN GITHUB/i }).first(),
  ).toBeVisible();
});

test('toggle de idioma cambia textos visibles', async ({ page }) => {
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Switch language' });
  await expect(toggle).toHaveText('ES');
  await toggle.click();

  await expect(toggle).toHaveText('EN');
  await expect(page.getByText(/v\d+\.\d+\.\d+ en npm/)).toBeVisible();
  await expect(page.locator('.hero-subtitle')).toContainText(
    /Escanea AGENTS\.md/,
  );
});
