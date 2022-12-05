import { createSlice } from '@reduxjs/toolkit'

import { eventApi } from '../../services/events'

interface IInitialState {
  eventUpdated: boolean | null
}

const initialState: IInitialState = {
  eventUpdated: null
}

const updateEventSlice = createSlice({
  name: 'updateEvent',
  initialState,
  reducers: {
    clearUpdateEvent: (state) => {
      state.eventUpdated = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventApi.endpoints.updateEvent.matchPending, (state, action) => {
        state.eventUpdated = null
      })
      .addMatcher(eventApi.endpoints.updateEvent.matchFulfilled, (state, action) => {
        state.eventUpdated = action.payload
      })
      .addMatcher(eventApi.endpoints.updateEvent.matchRejected, (state, action) => {
        state.eventUpdated = null
      })
  }
})

export default updateEventSlice.reducer
export const { clearUpdateEvent } = updateEventSlice.actions
