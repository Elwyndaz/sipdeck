const { test, expect } = require('@playwright/test');

test('wheel completes a spin and unlocks its controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/#/hjul');

  const spin = page.locator('.wheel-hub-button');
  const result = page.locator('#wheelResult');
  await expect(spin).toBeEnabled();

  await spin.click();
  await expect(spin).toBeDisabled();
  await expect(result).toBeVisible({ timeout: 10000 });
  await expect(result.locator('.wheel-result-name')).not.toBeEmpty();
  await expect(spin).toBeEnabled();
  expect(pageErrors).toEqual([]);
});
