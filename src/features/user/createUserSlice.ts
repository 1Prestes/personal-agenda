import { createSlice } from '@reduxjs/toolkit'

import { userApi, IUserResponse } from '../../services/user';
import { setUser } from './getUserSlice';

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

const createUserSlice = createSlice({
  name: 'createUser',
  initialState,
  reducers: {
    clearCreateUser: (state) => {
      state.user = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.createUser.matchPending, (state, action) => {
        state.user = null
        state.error = null
      })
      .addMatcher(userApi.endpoints.createUser.matchFulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
        console.log('porra')
        setUser(action.payload)
      })
      .addMatcher(userApi.endpoints.createUser.matchRejected, (state, action) => {
        state.user = null
        state.error = action.payload?.data as IError
      })
  },
})

export default createUserSlice.reducer
export const { clearCreateUser } = createUserSlice.actions
