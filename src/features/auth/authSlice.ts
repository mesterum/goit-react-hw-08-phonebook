// import axios from "redaxios"
import { Notify } from 'notiflix';
import { createAppSlice } from '../../app/createAppSlice'
import { authAPI } from './authAPI'
import { ReducerCreators } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type AuthState = {
  user: {
    name: string;
    email: string;
  } | null;
  token: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
}
type LoginResponse = {
  token: string;
  user: {
    name: string;
    email: string;
  };
}
const rejected: NonNullable<NonNullable<Parameters<ReducerCreators<AuthState>['asyncThunk']>[1]>['rejected']>
  = (_state, action) => {
    Notify.failure(action.error.message!)
    console.log(action.error);
  }

/* axios.defaults.baseURL = 'https://connections-api.herokuapp.com/';
axios.defaults.headers = { Authorization: '' } as const;

// Utility to add JWT
const setAuthHeader = (token: string) => {
  axios.defaults.headers!.Authorization = `Bearer ${token}`;
};

// Utility to remove JWT
const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
}; */

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

export const authSlice = createAppSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: create => ({
    refresh: create.asyncThunk(
      async (_, thunkAPI) => {
        // Reading the token from the state via getState()
        const { auth } = thunkAPI.getState() as RootState;
        const persistedToken = auth.token;

        if (persistedToken === null) {
          // If there is no token, exit without performing any request
          return thunkAPI.rejectWithValue('Unable to fetch user');
        }

        try {
          // If there is a token, add it to the HTTP header and perform the request
          // setAuthHeader(persistedToken);
          const res = await authAPI.get('current');
          return res.data;
        } catch (error) {
          return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
        }
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
          state.isLoggedIn = true;
          state.isRefreshing = false;
        },
        pending: (state) => {
          state.isRefreshing = true;
        },
        rejected: (state, action) => {
          state.isRefreshing = false;
          rejected(state, action);
        },
      }
    ),
    register: create.asyncThunk(
      async (credentials: Record<'name' | 'email' | 'password', string>, thunkAPI) => {
        try {
          const res = await authAPI.post('signup', credentials);
          // After successful registration, add the token to the HTTP header
          // setAuthHeader(res.data.token);
          return res.data as LoginResponse;
        } catch (error) {
          return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
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
      async (credentials: LoginResponse['user'], thunkAPI) => {
        try {
          const res = await authAPI.post('login', credentials);
          // After successful login, add the token to the HTTP header
          // setAuthHeader(res.data.token);
          return res.data as LoginResponse;
        } catch (error) {
          return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
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
    logout: create.asyncThunk(async (_, thunkAPI) => {
      try {
        await authAPI.post('logout');
        // After a successful logout, remove the token from the HTTP header
        // clearAuthHeader();
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error + '');
      }
    },
      {
        fulfilled: (state) => {
          state.user = null;
          state.token = null;
          state.isLoggedIn = false;
        },
        rejected: rejected,
      }),
  }),
  selectors: {
    selectIsLoggedIn: auth => auth.isLoggedIn,
    selectUser: auth => auth.user,
  },
})

export const { login, logout, register, refresh } = authSlice.actions

export const { selectIsLoggedIn, selectUser } = authSlice.selectors

export default authSlice.reducer

