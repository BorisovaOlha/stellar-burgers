import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { feedSlice } from '../slices/feedSlice';
import { userSlice } from '../slices/userSlice';
import { orderSlice } from '../slices/orderSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice,
  orderSlice
);
