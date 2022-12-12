import { createSlice } from '@reduxjs/toolkit'

import { groupApi, IGroup } from '../../services/group'

interface IInitialState {
  groups: [] | IGroup[]
  count: null | number
}

const initialState: IInitialState = {
  groups: [],
  count: null
}

const listGroupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroups: (state) => {
      state.count = null
      state.groups = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(groupApi.endpoints.listGroups.matchPending, (state, action) => {
        state.count = null
        state.groups = []
      })
      .addMatcher(groupApi.endpoints.listGroups.matchFulfilled, (state, action) => {
        state.count = action.payload?.count
        state.groups = action.payload?.rows
      })
      .addMatcher(groupApi.endpoints.listGroups.matchRejected, (state, action) => {
        state.count = null
        state.groups = []
      })
  }
})

export default listGroupsSlice.reducer
export const { clearGroups } = listGroupsSlice.actions
