import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'

import authSlice from '../features/auth/authSlice'
import createUserSlice from '../features/user/createUserSlice'
import getUserSlice from '../features/user/getUserSlice'
import listEventsSlice from '../features/events/listEventSlice'
import deleteEventSlice from '../features/events/deleteEventSlice'
import { api } from '../services/api'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
): ToolkitStore =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      authSlice,
      createUserSlice,
      getUserSlice,
      listEventsSlice,
      deleteEventSlice
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
