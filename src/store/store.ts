import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'

import authSlice from '../features/auth/authSlice'
import createUserSlice from '../features/user/createUserSlice'
import getUserSlice from '../features/user/getUserSlice'
import listEventsSlice from '../features/events/listEventSlice'
import { authApi } from '../services/auth'
import { userApi } from '../services/user'
import { eventApi } from '../services/events'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [eventApi.reducerPath]: eventApi.reducer,
      authSlice,
      createUserSlice,
      getUserSlice,
      listEventsSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(eventApi.middleware),
    ...options,
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
