import { test, expect } from '@playwright/test';

test.describe('тестирование создания заказа', () => {
  test('авторизованный пользователь может открыть профиль', async ({
    page,
    context
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/userData.har', {
      url: '**/auth/user',
      update: false
    });

    await page.goto('/profile');
    await expect(page.getByText('Профиль')).toBeVisible();
  });

  test('ответ на запрос создания заказа', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/userData.har', {
      url: '**/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');

    const bun = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();

    const ingredient = page
      .locator('li')
      .filter({ hasText: 'Хрустящие минеральные кольца' })
      .first();

    await expect(bun).toBeVisible();
    await expect(ingredient).toBeVisible();

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByText('Краторная булка N-200i (верх)', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Краторная булка N-200i (низ)', { exact: true })
    ).toBeVisible();

    const constructor = page.getByTestId('constructor');

    await expect(
      constructor.getByText('Хрустящие минеральные кольца', { exact: true })
    ).toBeVisible();

    await constructor
      .getByRole('button', {
        name: 'Оформить заказ'
      })
      .click();

    const orderModal = page.getByTestId('modal');
    await expect(orderModal).toBeVisible();

    await expect(
      orderModal.getByText('идентификатор заказа', { exact: true })
    ).toBeVisible();
  });
});
