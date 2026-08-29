import { test, expect } from '@playwright/test';

test('должен добавлять ингредиент в конструктор', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');

  const card = page
    .locator('li')
    .filter({ hasText: 'Хрустящие минеральные кольца' });

  await expect(card).toBeVisible();

  await card.getByRole('button', { name: 'Добавить' }).click();

  const constructor = page.getByTestId('constructor');

  await expect(
    constructor.getByText('Хрустящие минеральные кольца', { exact: true })
  ).toBeVisible();
});
