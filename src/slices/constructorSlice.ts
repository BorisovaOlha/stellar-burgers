import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';
import {
  orderBurgerApi,
  TOwner,
  TNewOrder,
  TNewOrderResponse
} from '../utils/burger-api';
import { useSelector } from 'react-redux';

interface TConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
}

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[]) => orderBurgerApi(ingredientsIds)
);

export const constructorSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeBun: (state) => {
      state.constructorItems.bun = null;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getConstructorData: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      });
  }
});

export const { getConstructorData } = constructorSlice.selectors;

export const {
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  clearOrderModalData
} = constructorSlice.actions;

export default constructorSlice.reducer;
