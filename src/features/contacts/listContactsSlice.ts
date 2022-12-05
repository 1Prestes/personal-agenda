import { createSlice } from '@reduxjs/toolkit'

import { contactApi, IContact } from '../../services/contact'

interface IError {
  code: string
  message: string
  shortMessage: string
}

interface IInitialState {
  contacts: [] | IContact[]
  count: null | number
  error: IError | null
}

const initialState: IInitialState = {
  contacts: [],
  count: null,
  error: null
}

const listContactsSlice = createSlice({
  name: 'listContacts',
  initialState,
  reducers: {
    clearListContacts: (state) => {
      state.contacts = []
      state.count = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(contactApi.endpoints.listContacts.matchPending, (state, action) => {
        state.contacts = []
        state.count = null
        state.error = null
      })
      .addMatcher(contactApi.endpoints.listContacts.matchFulfilled, (state, action) => {
        state.contacts = action.payload.rows
        state.count = action.payload.count
        state.error = null
      })
      .addMatcher(contactApi.endpoints.listContacts.matchRejected, (state, action) => {
        state.contacts = []
        state.count = null
        state.error = action.payload?.data as IError
      })
  }
})

export default listContactsSlice.reducer
export const { clearListContacts } = listContactsSlice.actions
