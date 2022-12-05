import { api } from './api'

export interface IContact {
  idcontact: string
  iduser: string
  name: string
  address: string
  birth_date: Date
}

export interface IContactResponse extends IContact {
  updatedAt: string
  createdAt: string
}

export interface IContactRequest {
  name: string
  birthDate: string
  address: string
  iduser: string
}

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<IContactResponse, IContactRequest>({
      query: (credentials) => ({
        url: '/contact',
        method: 'POST',
        body: credentials
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const { useCreateContactMutation, useProtectedMutation } = contactApi
