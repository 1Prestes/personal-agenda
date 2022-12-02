import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store/store'

export interface IUserResponse {
  iduser: string
  name: string
  username: string
  address: string
  birth_date: string
  updatedAt: string
  createdAt: string
}

export interface IUserRequest {
  name: string
  username: string
  password: string
  address: string
  birthDate: string
}

export const userApi = createApi({
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createUser: builder.mutation<IUserResponse, IUserRequest>({
      query: (credentials) => ({
        url: '/user',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUser: builder.mutation<IUserResponse, string>({
      query: (iduser) => ({
        url: `/user/${iduser}`,
        method: 'GET',
      }),
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),


  }),
})

export const { useCreateUserMutation, useGetUserMutation, useProtectedMutation } = userApi
