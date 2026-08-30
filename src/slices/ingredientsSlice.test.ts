import { describe, expect, test } from '@jest/globals';
import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png'
  }
];

describe('тестирование редьюсера слайса ingredientsSlice', () => {
  test('обрабатывает неизвестный экшен', () => {
    const newState = ingredientsSlice.reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(newState).toEqual(initialState);
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const initialIngredientsState = {
      ...initialState,
      ingredients,
      isIngredientsLoading: false,
      error: 'Ошибка'
    };

    const newState = ingredientsSlice.reducer(
      initialIngredientsState,
      fetchIngredients.pending('requestId')
    );

    expect(newState).toEqual({
      ...initialState,
      ingredients,
      isIngredientsLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const initialIngredientsState = {
      ...initialState,
      isIngredientsLoading: true
    };

    const newState = ingredientsSlice.reducer(
      initialIngredientsState,
      fetchIngredients.fulfilled(ingredients, 'requestId')
    );

    expect(newState).toEqual({
      ...initialState,
      ingredients,
      isIngredientsLoading: false
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const initialIngredientsState = {
      ...initialState,
      ingredients,
      isIngredientsLoading: true
    };

    const newState = ingredientsSlice.reducer(
      initialIngredientsState,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), 'requestId')
    );

    expect(newState).toEqual({
      ...initialState,
      ingredients,
      isIngredientsLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
