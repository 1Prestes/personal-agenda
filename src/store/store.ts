import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'

import auth from '../features/auth/authSlice'
import { authApi } from '../services/auth'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      auth,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
