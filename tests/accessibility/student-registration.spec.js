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

    await expect(page.locator('table caption')).toHaveText('Lista de estudiantes registrados');
    await expect(page.locator('#student-count')).toHaveAccessibleName(/\d+ estudiantes? registrados?/);
  });

  test('permite percorrer os controles principais com Tab', async ({ page }) => {
    await page.goto('/');

    await page.locator('#identification').focus();
    const visitedControls = ['identification'];

    for (let index = 0; index < 16; index += 1) {
      await page.keyboard.press('Tab');
      const focusedControl = await page.evaluate(() =>
        document.activeElement?.id || document.activeElement?.textContent?.trim() || ''
      );
      if (focusedControl !== visitedControls.at(-1)) visitedControls.push(focusedControl);
      if (focusedControl === 'Registrar estudiante') break;
    }

    expect(visitedControls).toEqual([
      'identification', 'first-name', 'last-name', 'email', 'country',
      'career', 'birth-date', 'age', 'clear-button', 'Registrar estudiante'
    ]);
  });
});
