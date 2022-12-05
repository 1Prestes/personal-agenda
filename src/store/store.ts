import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

import authSlice from '../features/auth/authSlice'
import createUserSlice from '../features/user/createUserSlice'
import getUserSlice from '../features/user/getUserSlice'
import listEventsSlice from '../features/events/listEventSlice'
import deleteEventSlice from '../features/events/deleteEventSlice'
import createEventSlice from '../features/events/createEventSlice'
import updateEventSlice from '../features/events/updateEventSlice'
import createContactSlice from '../features/contacts/createContactSlice'
import listContactsSlice from '../features/contacts/listContactsSlice'
import deleteContactSlice from '../features/contacts/deleteContactSlice'
import listContactsFromEvent from '../features/eventsRelationship/listContactsFromEventSlice'
import { api } from '../services/api'

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
      deleteEventSlice,
      createEventSlice,
      updateEventSlice,
      createContactSlice,
      listContactsSlice,
      deleteContactSlice,
      listContactsFromEvent
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options
  })

export const store = createStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
