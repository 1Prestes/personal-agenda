import { createSlice } from '@reduxjs/toolkit'

import { eventApi, } from '../../services/events';

const initialState = {
  deleted: null,
} as {
  deleted: boolean | null
}

const deleteEventSlice = createSlice({
  name: 'deleteEvents',
  initialState,
  reducers: {
    clearDeleteEvent: (state) => {
      state.deleted = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventApi.endpoints.deleteEvent.matchPending, (state, action) => {
        state.deleted = null
      })
      .addMatcher(eventApi.endpoints.deleteEvent.matchFulfilled, (state, action) => {
        state.deleted = action.payload
      })
      .addMatcher(eventApi.endpoints.deleteEvent.matchRejected, (state, action) => {
        state.deleted = null
      })
  },
})

export default deleteEventSlice.reducer
export const { clearDeleteEvent } = deleteEventSlice.actions

