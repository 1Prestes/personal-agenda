import { createSlice } from '@reduxjs/toolkit'

import { contactApi, IContactResponse } from '../../services/contact'

interface IError {
  code: string
  message: string
  shortMessage: string
}

interface IInitialState {
  contact: null | IContactResponse
  error: IError | null
}

const initialState: IInitialState = {
  contact: null,
  error: null
}

const createContactSlice = createSlice({
  name: 'createContact',
  initialState,
  reducers: {
    clearCreateContact: (state) => {
      state.contact = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(contactApi.endpoints.createContact.matchPending, (state, action) => {
        state.contact = null
        state.error = null
      })
      .addMatcher(contactApi.endpoints.createContact.matchFulfilled, (state, action) => {
        state.contact = action.payload
        state.error = null
      })
      .addMatcher(contactApi.endpoints.createContact.matchRejected, (state, action) => {
        state.contact = null
        state.error = action.payload?.data as IError
      })
  }
})

export default createContactSlice.reducer
export const { clearCreateContact } = createContactSlice.actions
