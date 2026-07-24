const { test, expect } = require('@playwright/test');

test('wheel completes a spin and unlocks its controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  const entry = page.locator('#wheelEntry');
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(page).toHaveURL(/\/#\/hjul$/);

  const spin = page.locator('.wheel-hub-button');
  const result = page.locator('#wheelResult');
  await expect(spin).toBeEnabled();

  await spin.click();
  await expect(spin).toBeDisabled();
  await expect(result).toBeVisible({ timeout: 10000 });
  await expect(result.locator('.wheel-result-name')).not.toBeEmpty();
  await expect(spin).toBeEnabled();

  await page.locator('[data-wheel-act="back"]').click();
  await expect(page).toHaveURL(/\/(?:#\/)?$/);
  await expect(entry).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/wheel-closing/);
  expect(pageErrors).toEqual([]);
});

test('reduced motion keeps wheel navigation immediate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await page.locator('#wheelEntry').click();
  await expect(page.locator('.wheel-hub-button')).toBeEnabled();
  await expect(page.locator('html')).not.toHaveClass(/wheel-(?:opening|fallback)/);

  await page.locator('[data-wheel-act="back"]').click();
  await expect(page.locator('#wheelEntry')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/wheel-(?:closing|fallback)/);
});

test('firefox keeps the shared wheel transition compositor-safe', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox');

  await page.goto('/');
  await page.locator('#wheelEntry').click();

  await expect(page.locator('html')).toHaveClass(/wheel-opening/);
  await expect(page.locator('html')).toHaveClass(/wheel-firefox/);
  await expect(page.locator('html')).not.toHaveClass(/wheel-fallback-opening/);
  await expect(page.locator('html')).not.toHaveClass(/wheel-(?:opening|firefox)/, { timeout: 2000 });

  await page.locator('[data-wheel-act="back"]').click();
  await expect(page.locator('html')).toHaveClass(/wheel-closing/);
  await expect(page.locator('html')).toHaveClass(/wheel-firefox/);
  await expect(page.locator('html')).not.toHaveClass(/wheel-(?:closing|firefox)/, { timeout: 2000 });
});
