import { api } from './api'

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

export const authApi = api.injectEndpoints({
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
  overrideExisting: false,
})

export const { useLoginMutation, useProtectedMutation } = authApi
