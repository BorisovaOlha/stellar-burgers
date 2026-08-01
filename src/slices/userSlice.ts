import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
  UnknownAction
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { TOrder } from '@utils-types';
import {
  registerUserApi,
  TOwner,
  TRegisterData,
  TLoginData,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi
} from '../utils/burger-api';
import { useSelector } from 'react-redux';
import { setCookie } from '../utils/cookie';

interface TUserState {
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: undefined
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () =>
  logoutApi()
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const getUser = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

const pending = (state: TUserState) => {
  state.isLoading = true;
  state.error = undefined;
};

const rejected = (
  state: TUserState,
  action: { error: { message?: string } }
) => {
  state.isLoading = false;
  state.error = action.error.message;
  state.isAuthChecked = true;
};

const authFulfilled = (
  state: TUserState,
  action: PayloadAction<{ user: TUser }>
) => {
  state.isLoading = false;
  state.user = action.payload.user;
  state.isAuthenticated = true;
  state.isAuthChecked = true;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserState: (state) => state,
    authenticatedSelector: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.rejected, rejected)
      .addCase(registerUser.fulfilled, authFulfilled)
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.rejected, rejected)
      .addCase(loginUser.fulfilled, authFulfilled)
      .addCase(logoutUser.pending, pending)
      .addCase(logoutUser.rejected, rejected)
      .addCase(logoutUser.fulfilled, (state: TUserState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.user = null;
      })
      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.rejected, rejected)
      .addCase(forgotPassword.fulfilled, (state: TUserState) => {
        state.isLoading = false;
      })
      .addCase(updateUser.pending, pending)
      .addCase(updateUser.rejected, rejected)
      .addCase(updateUser.fulfilled, (state: TUserState) => {
        state.isLoading = false;
      });
  }
});

export const { getUserState, authenticatedSelector } = userSlice.selectors;

// export const {
//   addBun,
//   removeBun,
//   addIngredient,
//   removeIngredient,
//   clearOrderModalData
// } = constructorSlice.actions;

// export default constructorSlice.reducer;

// В случае с заказами мы ориентируемся на данные,
// который возвращает сервер. Если данные не соответствуют типу
// заданному в коде проекта, нужно либо поправить этот тип
// (если он больше нигде не используется кроме как для этого запроса),
// либо создать новый тип специально для этого запроса.
