import { test, expect } from '@playwright/test';

test.describe('тестирование работы модальных окон', () => {
  test('окно должно открываться', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const card = page
      .locator('li')
      .filter({ hasText: 'Хрустящие минеральные кольца' });

    await card.locator('a').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByText('Хрустящие минеральные кольца', { exact: true })
    ).toBeVisible();
  });

  test('окно должно закрываться по крестику', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    const card = page
      .locator('li')
      .filter({ hasText: 'Хрустящие минеральные кольца' });

    await card.locator('a').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await modal.getByRole('button').click();

    await expect(modal).not.toBeVisible();
  });
});
