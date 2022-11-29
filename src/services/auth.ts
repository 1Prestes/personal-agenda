import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../store/store'

export interface IUserResponse {
	iduser: string
	name: string
	username: string
	birthDate: Date
	address: string
	createdAt: Date
	updatedAt: Date
	token: string
}

export interface ILoginRequest {
  username: string
  password: string
}

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4005/local/v1/schedule/',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token
      headers.set('Content-Type', 'application/json')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IUserResponse, ILoginRequest>({
      query: (credentials) => ({
        url: '/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),
  }),
})

export const { useLoginMutation, useProtectedMutation } = authApi
