import { describe, expect, test } from '@jest/globals';
import {
  constructorSlice,
  initialState,
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  clearOrderModalData,
  createOrder
} from './constructorSlice';
import { TConstructorIngredient } from '../utils/types';
import { TNewOrder } from '../utils/burger-api';

const bun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'constructor-bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const ingredient: TConstructorIngredient = {
  _id: 'ingredient-1',
  id: 'constructor-ingredient-1',
  name: 'Хрустящие минеральные кольца',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 30,
  calories: 100,
  price: 300,
  image: 'ingredient.png',
  image_large: 'ingredient-large.png',
  image_mobile: 'ingredient-mobile.png'
};

const order: TNewOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Test order',
  owner: {
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '',
    updatedAt: ''
  },
  createdAt: '',
  updatedAt: '',
  number: 5540,
  price: 1000
};

describe('тестирование редьюсера слайса constructorSlice', () => {
  test('обрабатывает неизвестный экшен', () => {
    const newState = constructorSlice.reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(newState).toEqual(initialState);
  });

  describe('синхронные экшены', () => {
    test('добавляет булку', () => {
      const newState = constructorSlice.reducer(initialState, addBun(bun));

      expect(newState.constructorItems.bun).toEqual(
        expect.objectContaining({
          _id: bun._id,
          name: bun.name
        })
      );
    });

    test('удаляет булку', () => {
      const state = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          bun
        }
      };

      const newState = constructorSlice.reducer(state, removeBun());

      expect(newState.constructorItems.bun).toBeNull();
    });

    test('добавляет ингредиент', () => {
      const newState = constructorSlice.reducer(
        initialState,
        addIngredient(ingredient)
      );

      expect(newState.constructorItems.ingredients).toHaveLength(1);

      expect(newState.constructorItems.ingredients[0]).toEqual(
        expect.objectContaining({
          _id: ingredient._id,
          name: ingredient.name
        })
      );
    });

    test('удаляет ингредиент', () => {
      const state = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [ingredient]
        }
      };

      const newState = constructorSlice.reducer(
        state,
        removeIngredient(ingredient.id)
      );

      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });

    test('очищает данные модального окна', () => {
      const state = {
        ...initialState,
        orderModalData: order
      };

      const newState = constructorSlice.reducer(state, clearOrderModalData());

      expect(newState.orderModalData).toBeNull();
    });
  });

  describe('асинхронные экшены', () => {
    test('обрабатывает createOrder.pending', () => {
      const newState = constructorSlice.reducer(
        initialState,
        createOrder.pending('requestID', ['bun', 'ingredient'])
      );

      expect(newState).toEqual({
        ...initialState,
        orderRequest: true
      });
    });

    test('обрабатывает createOrder.rejected', () => {
      const state = {
        ...initialState,
        orderRequest: true
      };

      const newState = constructorSlice.reducer(
        state,
        createOrder.rejected(new Error('Ошибка создания заказа'), 'requestID', [
          'bun',
          'ingredient'
        ])
      );

      expect(newState).toEqual({
        ...initialState,
        orderRequest: false
      });
    });

    test('обрабатывает createOrder.fulfilled', () => {
      const state = {
        ...initialState,
        constructorItems: {
          bun,
          ingredients: [ingredient]
        },
        orderRequest: true
      };

      const newState = constructorSlice.reducer(
        state,
        createOrder.fulfilled(
          {
            success: true,
            name: 'Минеральный краторный бургер',
            order
          },
          'requestId',
          ['bun-1', 'ingredient-1']
        )
      );

      expect(newState).toEqual({
        ...initialState,
        orderRequest: false,
        orderModalData: order,
        constructorItems: {
          bun: null,
          ingredients: []
        }
      });
    });
  });
});
