import { createSlice } from '@reduxjs/toolkit'

import { eventApi, IEvent } from '../../services/events';

const initialState = {
  events: [],
  count: null
} as {
  events: [] | IEvent[]
  count: null | number
}

const listEventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.count = null
      state.events = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventApi.endpoints.listEvents.matchPending, (state, action) => {
        state.count = null
        state.events = []
      })
      .addMatcher(eventApi.endpoints.listEvents.matchFulfilled, (state, action) => {
        state.count = action.payload?.count
        state.events = action.payload?.rows
      })
      .addMatcher(eventApi.endpoints.listEvents.matchRejected, (state, action) => {
        state.count = null
        state.events = []
      })
  },
})

export default listEventsSlice.reducer
export const { clearEvents } = listEventsSlice.actions

