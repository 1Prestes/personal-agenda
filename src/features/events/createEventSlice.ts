import { createSlice } from '@reduxjs/toolkit'

import { eventApi } from '../../services/events'

interface IInitialState {
  idevent: string | null
  title: string | null
  description: string | null
  initialDate: Date | null
  finalDate: Date | null
  place: string | null
  iduser: string | null
}

const initialState: IInitialState = {
  idevent: null,
  title: null,
  description: null,
  initialDate: null,
  finalDate: null,
  place: null,
  iduser: null
}

const createEventSlice = createSlice({
  name: 'createEvent',
  initialState,
  reducers: {
    clearCreateEvent: (state) => {
      state.idevent = null
      state.title = null
      state.description = null
      state.initialDate = null
      state.finalDate = null
      state.place = null
      state.iduser = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(eventApi.endpoints.createEvent.matchPending, (state, action) => {
        state.idevent = null
        state.title = null
        state.description = null
        state.initialDate = null
        state.finalDate = null
        state.place = null
        state.iduser = null
      })
      .addMatcher(eventApi.endpoints.createEvent.matchFulfilled, (state, action) => {
        state.idevent = action.payload.idevent
        state.title = action.payload.title
        state.description = action.payload.description
        state.initialDate = action.payload.initial_date
        state.finalDate = action.payload.final_date
        state.place = action.payload.place
        state.iduser = action.payload.iduser
      })
      .addMatcher(eventApi.endpoints.createEvent.matchRejected, (state, action) => {
        state.idevent = null
        state.title = null
        state.description = null
        state.initialDate = null
        state.finalDate = null
        state.place = null
        state.iduser = null
      })
  }
})

export default createEventSlice.reducer
export const { clearCreateEvent } = createEventSlice.actions
