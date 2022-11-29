import { createSlice } from '@reduxjs/toolkit'

import { authApi, IUserResponse } from '../../services/auth';
import { RootState } from '../../store/store';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
} as { user: null | IUserResponse; token: string | null; isAuthenticated: boolean }

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
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export default slice.reducer

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
