import { test, expect } from '@playwright/test';

test.describe('Falhas de carregamento', () => {
  test('informa quando a API de estudantes está indisponível', async ({ page }) => {
    await page.route('**/api/students', route => route.abort());
    await page.goto('/');

    await expect(page.getByRole('status').filter({
      hasText: 'No fue posible cargar los estudiantes.'
    })).toBeVisible();
    await expect(page.locator('#student-count')).toHaveAccessibleName('0 estudiantes registrados');
    await expect(page.locator('#student-list tr')).toHaveCount(0);
  });
});
