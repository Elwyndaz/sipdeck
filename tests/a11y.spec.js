const { test, expect } = require('@playwright/test');

test('deck exposes only the current card and flips from the keyboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText(/Cocktail deck|Drinkkortlek/);
  expect(await page.locator('.card[data-depth]:not([data-depth="0"])').evaluateAll(cards =>
    cards.every(card => card.inert && card.tabIndex === -1))).toBe(true);

  const card = page.locator('.card[data-depth="0"]');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveClass(/flipped/);
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  expect(await card.locator('.card-front').evaluate(face => face.inert)).toBe(true);
  expect(await card.locator('.card-back').evaluate(face => face.inert)).toBe(false);

  await page.keyboard.press('Space');
  await expect(card).not.toHaveClass(/flipped/);
  await expect(card.locator('.units button.active')).toHaveAttribute('aria-pressed', 'true');
  await expect(card.locator('.missing .sr-only').first()).toContainText(/Missing|Saknar/);
});

test('account errors are announced and associated with their fields', async ({ page }) => {
  await page.goto('/#/installningar');

  const error = page.locator('#accError');
  await expect(error).toHaveAttribute('role', 'status');
  await expect(error).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#accEmail')).toHaveAttribute('aria-describedby', 'accError');
  await expect(page.locator('#accPw')).toHaveAttribute('aria-describedby', 'accError');
});
