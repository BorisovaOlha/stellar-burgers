import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';

export const rootReducer = combineSlices(ingredientsSlice, constructorSlice);
