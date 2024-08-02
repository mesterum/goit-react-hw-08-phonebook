/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "redaxios"
import { Notify } from 'notiflix';
import { createAppSlice } from '../../app/createAppSlice'
import { authAPI, clearAuthHeader, setAuthHeader } from './authAPI'
import { Action, PayloadAction, ReducerCreators } from '@reduxjs/toolkit';
import { store } from '../../app/store';
import { useAppSelector } from '../../app/hooks';

type User<LoggedIn extends boolean = boolean> = LoggedIn extends true ? {
  name: string;
  email: string;
} : null
type AuthStateGen<LoggedIn extends boolean = boolean> = {
  readonly isLoggedIn: LoggedIn;
  readonly user: User<LoggedIn>;
  token: string | (LoggedIn extends false ? null : never);
  isRefreshing: boolean;
}
type AuthState = AuthStateGen<true> | AuthStateGen<false>
// const t: PromiseWithResolvers<any> = Promise.withResolvers()
type LoginResponse = {
  token: string;
  user: {
    name: string;
    email: string;
  };
}
type RefreshToken = {
  token: string | null;
}
const rejected: NonNullable<NonNullable<Parameters<ReducerCreators<AuthState>['asyncThunk']>[1]>['rejected']>
  = (_state, action) => {
    // console.log(action.error);
    if (action.error.message)
      Notify.failure(action.error.message)
  }

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isRefreshing: true,
} as AuthState;

export const authSlice = createAppSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: create => ({
    refresh: create.asyncThunk(
      async (refreshToken: RefreshToken) => {
        const persistedToken = refreshToken.token;

        try {
          if (persistedToken == null) {
            // If there is no token, exit without performing any request
            throw new Error(''); //No token to refresh
          }
          // If there is a token, add it to the HTTP header and perform the request
          setAuthHeader(persistedToken);
          const res: Response<LoginResponse["user"]> = await authAPI.get('current');
          return res.data;
        } catch (error: any) {
          // return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
          throw error.data ?? error;
        }
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
          state.isLoggedIn = true;
        },
        pending: (state) => {
          state.isRefreshing = true;
        },
        rejected,
        settled: (state) => {
          state.isRefreshing = false;
        },
      }
    ),
    register: create.asyncThunk(
      async (credentials: Record<'name' | 'email' | 'password', string>) => {
        try {
          const res = await authAPI.post('signup', credentials);
          // After successful registration, add the token to the HTTP header
          setAuthHeader(res.data.token);
          return res.data as LoginResponse;
        } catch (error: any) {
          // return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
          throw error.data ?? error;
        }
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLoggedIn = true;
        },
        rejected: rejected,
      }
    ),
    login: create.asyncThunk(
      async (credentials: Record<'email' | 'password', string>) => {
        try {
          const res: Response<LoginResponse> = await authAPI.post('login', credentials);
          // After successful login, add the token to the HTTP header
          setAuthHeader(res.data.token);
          return res.data;
        } catch (error: any) {
          // return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
          throw error.data ?? error;
        }
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLoggedIn = true;
        },
        rejected: rejected,
      }
    ),
    logout: create.asyncThunk(async () => {
      try {
        await authAPI.post('logout');
        // logging?.resolve(false);
        // After a successful logout, remove the token from the HTTP header
        clearAuthHeader();
      } catch (error: any) {
        // logging?.resolve(true);
        // return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
        throw error.data ?? error;
      }
    },
      {
        fulfilled: (state) => {
          state.user = null;
          state.token = null;
          state.isLoggedIn = false;
        },
        pending: (state) => {
          state.isRefreshing = true;
        },
        rejected,
        settled: (state) => {
          state.isRefreshing = false;
        },
      }),
  }),
  selectors: {
    selectIsLoggedIn: auth => auth.isLoggedIn,
    selectUser: auth => auth.user,
  },
})

export const { login, logout, register, refresh } = authSlice.actions

export const { selectIsLoggedIn, selectUser } = authSlice.selectors
export const selectAuth = authSlice.selectSlice
export const useAuth = () => useAppSelector(selectAuth)

startAppListening({
  type: REHYDRATE,
  async effect(_action, listenerApi) {
    const action = _action as Action<typeof REHYDRATE> & {
      key: string;
    } & PayloadAction<{
      token: string | null;
    }>;
    if (action.key !== 'auth') return;
    // logging ??= Promise.withResolvers<boolean>()
    if (action.payload)
      await listenerApi.dispatch(refresh(action.payload))
    logging.resolve(await isLoggedIn())
    // logging = null;
  }
})

const logging = Promise.withResolvers<boolean>();
export async function isLoggedIn(): Promise<boolean> {
  const auth = selectAuth(store.getState())
  if (!auth.isRefreshing) return auth.isLoggedIn
  return logging.promise
}/* 
export function loggingOut() {
  const loggingOut = Promise.withResolvers<boolean>()
  logging = loggingOut;
  store.dispatch(logout())
  return loggingOut.promise
} */


import { persistReducer, REHYDRATE, type PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { Response } from 'redaxios';
import { startAppListening } from '../../app/listenerMiddleware';
// Persisting token field from auth slice to localstorage
const authPersistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};
export default persistReducer(authPersistConfig, authSlice.reducer)