import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'

import authSlice from '../features/auth/authSlice'
import createUserSlice from '../features/user/createUserSlice'
import getUserSlice from '../features/user/getUserSlice'
import { authApi } from '../services/auth'
import { userApi } from '../services/user'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      authSlice,
      createUserSlice,
      getUserSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
