import { createSlice } from '@reduxjs/toolkit'

import { IContactsFromGroupResponse, groupRelationshipApi } from '../../services/groupsRelationship'

interface InitialState {
  group: [] | IContactsFromGroupResponse
}

const initialState: InitialState = {
  group: []
}

const listContactsFromGroupSlice = createSlice({
  name: 'listContactsFromGroup',
  initialState,
  reducers: {
    clearContactsFromGroup: (state) => {
      state.group = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(groupRelationshipApi.endpoints.listContactsFromGroup.matchPending, (state, action) => {
        state.group = []
      })
      .addMatcher(groupRelationshipApi.endpoints.listContactsFromGroup.matchFulfilled, (state, action) => {
        state.group = action.payload
      })
      .addMatcher(groupRelationshipApi.endpoints.listContactsFromGroup.matchRejected, (state, action) => {
        state.group = []
      })
  }
})

export default listContactsFromGroupSlice.reducer
export const { clearContactsFromGroup } = listContactsFromGroupSlice.actions
