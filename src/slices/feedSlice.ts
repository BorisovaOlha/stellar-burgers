import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const fetchFeed = createAsyncThunk('feed/getFeed', async () =>
  getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getAllOrders: (state) => state.orders,
    getTotalOrdersNumber: (state) => state.total,
    getTotalTodayOrdersNumber: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const { getAllOrders, getTotalOrdersNumber, getTotalTodayOrdersNumber } =
  feedSlice.selectors;
