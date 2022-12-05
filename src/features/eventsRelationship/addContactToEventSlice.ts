import { createSlice } from '@reduxjs/toolkit'

import { eventRelationshipApi, IContactsFromEventResponse } from '../../services/eventsRelationship'

interface InitialState {
  event: [] | IContactsFromEventResponse
}

const initialState: InitialState = {
  event: []
}

const addContactToEventSlice = createSlice({
  name: 'addContactToEvent',
  initialState,
  reducers: {
    clearContactsFromEvent: (state) => {
      state.event = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventRelationshipApi.endpoints.addContactToEvent.matchPending, (state, action) => {
        state.event = []
      })
      .addMatcher(eventRelationshipApi.endpoints.addContactToEvent.matchFulfilled, (state, action) => {
        state.event = action.payload
      })
      .addMatcher(eventRelationshipApi.endpoints.addContactToEvent.matchRejected, (state, action) => {
        state.event = []
      })
  }
})

export default addContactToEventSlice.reducer
export const { clearContactsFromEvent } = addContactToEventSlice.actions
