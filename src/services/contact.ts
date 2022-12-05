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

export interface IContactsResponse {
  count: number
  rows: IContact[]
}

export interface IDeleteContactRequest {
  idcontact: string
  iduser: string
}

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<IContactResponse, IContactRequest>({
      query: (props) => ({
        url: '/contact',
        method: 'POST',
        body: props
      })
    }),
    listContacts: builder.mutation<IContactsResponse, string>({
      query: (iduser) => ({
        url: `/contacts?iduser=${iduser}`,
        method: 'GET'
      })
    }),
    deleteContact: builder.mutation<boolean, IDeleteContactRequest>({
      query: (props) => ({
        url: `/contact/${props.idcontact}/user/${props.iduser}`,
        method: 'DELETE'
      })
    }),
    protected: builder.mutation<{ message: string }, null>({
      query: () => 'protected'
    })
  }),
  overrideExisting: false
})

export const {
  useCreateContactMutation,
  useListContactsMutation,
  useDeleteContactMutation,
  useProtectedMutation
} = contactApi
