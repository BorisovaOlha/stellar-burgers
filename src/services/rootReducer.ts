import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { feedSlice } from '../slices/feedSlice';
import { userSlice } from '../slices/userSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice
);
