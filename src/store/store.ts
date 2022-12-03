import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'

import authSlice from '../features/auth/authSlice'
import createUserSlice from '../features/user/createUserSlice'
import getUserSlice from '../features/user/getUserSlice'
import listEventsSlice from '../features/events/listEventSlice'
import { api } from '../services/api'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      authSlice,
      createUserSlice,
      getUserSlice,
      listEventsSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
