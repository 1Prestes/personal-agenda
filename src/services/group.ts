import { api } from './api'

export interface IGroup {
  idgroup: string
  iduser: string
  title: string
}

export interface IGroupResponse extends IGroup {
  updatedAt: string
  createdAt: string
}

export interface IGroupRequest {
  iduser: string
  title: string
}

export interface IGroupsResponse {
  count: number
  rows: IGroup[]
}

export interface IDeleteGroupRequest {
  idgroup: string
  iduser: string
}

export interface IUpdateGroupRequest {
  iduser: string
  idgroup: string
  title: string
}

export const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<IGroupResponse, IGroupRequest>({
      query: (props) => ({
        url: '/group',
        method: 'POST',
        body: props
      })
    }),
    listGroups: builder.mutation<IGroupsResponse, string>({
      query: (iduser) => ({
        url: `/groups?iduser=${iduser}`,
        method: 'GET'
      })
    }),
    updateGroup: builder.mutation<boolean, IUpdateGroupRequest>({
      query: (props) => ({
        url: '/group',
        method: 'PUT',
        body: props
      })
    }),
    deleteGroup: builder.mutation<boolean, IDeleteGroupRequest>({
      query: (props) => ({
        url: `/group/${props.idgroup}/user/${props.iduser}`,
        method: 'DELETE'
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const {
  useCreateGroupMutation,
  useListGroupsMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useProtectedMutation
} = groupApi
