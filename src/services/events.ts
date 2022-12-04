import { api } from './api'

export interface IEvent {
  idevent: string
  title: string
  description: string
  initial_date: Date
  final_date: Date
  place: string
  iduser: string
}

export interface IEventResponse {
  count: number
  rows: IEvent[]
}

export interface IDeleteEventRequest {
  iduser: string
  idevent: string
}

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.mutation<IEventResponse, string>({
      query: (iduser) => ({
        url: `/user/${iduser}/events`,
        method: 'GET'
      })
    }),
    deleteEvent: builder.mutation<boolean, IDeleteEventRequest>({
      query: (params) => ({
        url: `/user/${params.iduser}/event/${params.idevent}`,
        method: 'DELETE'
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const { useListEventsMutation, useDeleteEventMutation, useProtectedMutation } = eventApi
