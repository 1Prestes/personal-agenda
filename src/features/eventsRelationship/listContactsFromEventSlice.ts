import { createSlice } from '@reduxjs/toolkit'

import { eventRelationshipApi, IContactsFromEventResponse } from '../../services/eventsRelationship'

interface InitialState {
  event: [] | IContactsFromEventResponse
}

const initialState: InitialState = {
  event: []
}

const listContactsFromEventSlice = createSlice({
  name: 'listContactsFromEvents',
  initialState,
  reducers: {
    clearContactsFromEvent: (state) => {
      state.event = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventRelationshipApi.endpoints.listContactsFromEvent.matchPending, (state, action) => {
        state.event = []
      })
      .addMatcher(eventRelationshipApi.endpoints.listContactsFromEvent.matchFulfilled, (state, action) => {
        state.event = action.payload
      })
      .addMatcher(eventRelationshipApi.endpoints.listContactsFromEvent.matchRejected, (state, action) => {
        state.event = []
      })
  }
})

export default listContactsFromEventSlice.reducer
export const { clearContactsFromEvent } = listContactsFromEventSlice.actions
