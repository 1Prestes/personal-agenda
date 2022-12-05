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

export interface IAddContactToEventRequest extends IContactsFromEventRequest {
  idcontact: string
}

export const eventRelationshipApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listContactsFromEvent: builder.mutation<IContactsFromEventResponse, IContactsFromEventRequest>({
      query: (params) => ({
        url: `/event/${params.idevent}/user/${params.iduser}/contacts`,
        method: 'GET'
      })
    }),
    addContactToEvent: builder.mutation<IContactsFromEventResponse, IAddContactToEventRequest>({
      query: (params) => ({
        url: '/event/add-contact',
        method: 'POST',
        body: params
      })
    }),
    removeContactFromEvent: builder.mutation<boolean, IAddContactToEventRequest>({
      query: (params) => ({
        url: '/event/remove-contact',
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
  useListContactsFromEventMutation,
  useAddContactToEventMutation,
  useRemoveContactFromEventMutation,
  useProtectedMutation
} = eventRelationshipApi
