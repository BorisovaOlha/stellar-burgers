import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { TOrder } from '@utils-types';

interface TConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    }
  },
  selectors: {
    getConstructorItems: (state) => state
  }
});

export const { getConstructorItems } = constructorSlice.selectors;
