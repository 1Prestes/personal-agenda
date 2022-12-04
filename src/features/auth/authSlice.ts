import { createSlice } from '@reduxjs/toolkit'

import { getToken, removeToken } from '../../helpers/storage'
import { authApi, IUserResponse } from '../../services/auth'
import { RootState } from '../../store/store'
import { setUser } from '../user/getUserSlice'

interface IError {
  code: string
  message: string
  shortMessage: string
}

interface IInitialState {
  user: null | IUserResponse
  token: string | null
  isAuthenticated: boolean
  error: IError | null
}

const initialState: IInitialState = {
  user: null,
  token: getToken() ?? null,
  isAuthenticated: false,
  error: null
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeToken()
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state, action) => {
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
        setUser(action.payload)
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload?.data as IError
      })
  }
})

export default slice.reducer
export const { logout } = slice.actions

export const selectIsAuthenticated = (state: RootState): string =>
  state.authSlice.isAuthenticated
