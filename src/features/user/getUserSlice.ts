import { createSlice } from '@reduxjs/toolkit'

import { userApi, IUserResponse } from '../../services/user';

interface IError {
  code: string
  message: string,
  shortMessage: string
}

const initialState = {
  user: null,
  error: null,
} as {
  user: null | IUserResponse;
  error: IError | null;
}

const getUserSlice = createSlice({
  name: 'getUser',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null
      state.error = null
    },
    setUser: (state, action) => {
      console.log('estou aca ', action.payload)
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.getUser.matchPending, (state, action) => {
        state.user = null
        state.error = null
      })
      .addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.user = null
        state.error = action.payload?.data as IError
      })
  },
})

export default getUserSlice.reducer
export const { clearUser, setUser } = getUserSlice.actions
