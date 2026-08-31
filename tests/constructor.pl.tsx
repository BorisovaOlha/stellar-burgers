import { test, expect } from '@playwright/test';

test.describe('Интеграционные тесты для страницы конструктора бургера', () => {
  test('должен добавлять ингредиент в конструктор', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.goto('/');

    const constructor = page.getByTestId('constructor');

    await expect(
      constructor.getByText('Выберите булки', { exact: true })
    ).toHaveCount(2);
    await expect(
      constructor.getByText('Выберите начинку', { exact: true })
    ).toBeVisible();

    const card = page
      .locator('li')
      .filter({ hasText: 'Хрустящие минеральные кольца' });

    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Добавить' }).click();
    await expect(
      constructor.getByText('Хрустящие минеральные кольца', { exact: true })
    ).toBeVisible();
  });

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

      await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients',
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
      const constructor = page.getByTestId('constructor');
      const orderModal = page.getByTestId('modal');

      await expect(
        constructor.getByText('Выберите булки', { exact: true })
      ).toHaveCount(2);
      await expect(
        constructor.getByText('Выберите начинку', { exact: true })
      ).toBeVisible();

      // Собирается бургер
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
        constructor.getByText('Краторная булка N-200i (верх)', { exact: true })
      ).toBeVisible();

      await expect(
        constructor.getByText('Краторная булка N-200i (низ)', { exact: true })
      ).toBeVisible();

      await expect(
        constructor.getByText('Хрустящие минеральные кольца', { exact: true })
      ).toBeVisible();

      // Вызывается клик по кнопке «Оформить заказ»
      await expect(orderModal).not.toBeVisible();

      await constructor
        .getByRole('button', {
          name: 'Оформить заказ'
        })
        .click();

      // Проверяется, что модальное окно открылось и номер заказа верный

      await expect(orderModal).toBeVisible();

      await expect(
        orderModal.getByText('идентификатор заказа', { exact: true })
      ).toBeVisible();

      await expect(orderModal.getByText('5540', { exact: true })).toBeVisible();

      // Проверяется, что конструктор пуст
      await expect(
        constructor.getByText('Выберите булки', { exact: true })
      ).toHaveCount(2);

      await expect(
        constructor.getByText('Выберите начинку', { exact: true })
      ).toBeVisible();

      // Закрывается модальное окно и проверяется успешность закрытия

      await orderModal.getByRole('button').click();

      await expect(orderModal).not.toBeVisible();
    });
  });

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

      const modal = page.getByTestId('modal');
      await expect(modal).not.toBeVisible();

      await card.locator('a').click();

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
});
