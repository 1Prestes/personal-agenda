import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../store/store'

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

export const eventApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4005/local/v1/schedule/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authSlice?.token
      headers.set('Content-Type', 'application/json')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
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
})

export const { useListEventsMutation, useProtectedMutation } = eventApi
