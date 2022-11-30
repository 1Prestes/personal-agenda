import { createSlice } from '@reduxjs/toolkit'

import { authApi, IUserResponse } from '../../services/auth';
import { RootState } from '../../store/store';

interface IError {
  code: string
  message: string,
  shortMessage: string
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
} as {
  user: null | IUserResponse;
  token: string | null;
  isAuthenticated: boolean;
  error: IError | null
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload?.data as IError
      })
  },
})

export default slice.reducer

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
