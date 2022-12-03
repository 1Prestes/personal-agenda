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

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.mutation<IEventResponse, string>({
      query: (iduser) => ({
        url: `/user/${iduser}/events`,
        method: 'GET',
      }),
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),
  }),
  overrideExisting: false,
})

export const { useListEventsMutation, useProtectedMutation } = eventApi
