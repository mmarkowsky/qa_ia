import { test, expect } from '@playwright/test';

test.describe('Acessibilidade do cadastro de estudantes', () => {
  test('mantém a hierarquia de títulos e nomes acessíveis dos campos', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(2);

    const fields = page.locator('input:not([readonly]), select');
    const fieldCount = await fields.count();
    expect(fieldCount).toBe(7);

    for (let index = 0; index < fieldCount; index += 1) {
      await expect(fields.nth(index)).toHaveAccessibleName(/.+/);
    }
  });

  test('permite percorrer os controles principais com Tab', async ({ page }) => {
    await page.goto('/');

    await page.locator('#identification').focus();
    const visitedIds = new Set(['identification']);

    for (let index = 0; index < 20; index += 1) {
      await page.keyboard.press('Tab');
      const focusedId = await page.evaluate(() => document.activeElement?.id || '');
      if (focusedId) visitedIds.add(focusedId);
      if (!focusedId || focusedId === 'clear-button') break;
    }

    expect(visitedIds).toEqual(new Set([
      'identification', 'first-name', 'last-name', 'email', 'country',
      'career', 'birth-date', 'age', 'clear-button'
    ]));
  });
});
