import { api } from './api'

import { IEvent } from './events'
import { IContact } from './contact'

interface IContactFromEventRelationship {
  eventIdevent: string
  contactIdcontact: string
}

interface IContactFromEvent extends IContact {
  contact_has_events: IContactFromEventRelationship
}

export interface IContactsFromEventResponse extends IEvent {
  contacts: [] | IContactFromEvent[]
}

export interface IContactsFromEventRequest {
  iduser: string
  idevent: string
}

export const eventRelationshipApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listContactsFromEvent: builder.mutation<IContactsFromEventResponse, IContactsFromEventRequest>({
      query: (params) => ({
        url: `/event/${params.idevent}/user/${params.iduser}/contacts`,
        method: 'GET'
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const {
  useListContactsFromEventMutation,
  useProtectedMutation
} = eventRelationshipApi
