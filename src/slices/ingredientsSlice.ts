import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface ingredientsListState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null | undefined;
}

const initialState: ingredientsListState = {
  ingredients: [],
  isIngredientsLoading: true,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // addIngredient: (state, action: PayloadAction<TIngredient>) => {
    //   state.ingredients.push(action.payload);
    // },
    // removeIngredient: (state, action) => {
    //   state.ingredients = state.ingredients.filter(i => i.id !== action.payload);
    // }
  },
  selectors: {
    getIngredientsSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { getIngredientsSelector } = ingredientsSlice.selectors;
