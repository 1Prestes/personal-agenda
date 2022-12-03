import { api } from './api'

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

export const userApi = api.injectEndpoints({
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
  overrideExisting: false,
})

export const { useCreateUserMutation, useGetUserMutation, useProtectedMutation } = userApi
