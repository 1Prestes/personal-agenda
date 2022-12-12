import { api } from './api'

import { IContact } from './contact'
import { IGroup } from './group'

interface IContactFromGroupRelationship {
  groupIdgroup: string
  contactIdcontact: string
}

interface IContactFromGroup extends IContact {
  contact_has_group: IContactFromGroupRelationship
}

export interface IContactsFromGroupResponse extends IGroup {
  contacts: [] | IContactFromGroup[]
}

export interface IContactsFromGroupRequest {
  iduser: string
  idgroup: string
}

export interface IAddContactToGroupRequest extends IContactsFromGroupRequest {
  idcontact: string
}

export const groupRelationshipApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listContactsFromGroup: builder.mutation<IContactsFromGroupResponse, IContactsFromGroupRequest>({
      query: (params) => ({
        url: `/group/${params.idgroup}/user/${params.iduser}`,
        method: 'GET'
      })
    }),
    addContactToGroup: builder.mutation<IContactsFromGroupResponse, IAddContactToGroupRequest>({
      query: (params) => ({
        url: '/group/add-contact',
        method: 'POST',
        body: params
      })
    }),
    removeContactFromGroup: builder.mutation<boolean, IAddContactToGroupRequest>({
      query: (params) => ({
        url: '/group/remove-contact',
        method: 'POST',
        body: params
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const {
  useListContactsFromGroupMutation,
  useAddContactToGroupMutation,
  useRemoveContactFromGroupMutation,
  useProtectedMutation
} = groupRelationshipApi
