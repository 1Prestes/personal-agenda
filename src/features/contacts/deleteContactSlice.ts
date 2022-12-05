import { createSlice } from '@reduxjs/toolkit'

import { contactApi } from '../../services/contact'

interface IInitialState {
  deleted: boolean | null
}

const initialState: IInitialState = {
  deleted: null
}

const deleteEventSlice = createSlice({
  name: 'deleteContacts',
  initialState,
  reducers: {
    clearDeleteContact: (state) => {
      state.deleted = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(contactApi.endpoints.deleteContact.matchPending, (state, action) => {
        state.deleted = null
      })
      .addMatcher(contactApi.endpoints.deleteContact.matchFulfilled, (state, action) => {
        state.deleted = action.payload
      })
      .addMatcher(contactApi.endpoints.deleteContact.matchRejected, (state, action) => {
        state.deleted = null
      })
  }
})

export default deleteEventSlice.reducer
export const { clearDeleteContact } = deleteEventSlice.actions
