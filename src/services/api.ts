import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store/store'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4005/local/v1/schedule/',
    prepareHeaders: (headers, { getState }) => {
      const token: string = (getState() as RootState).authSlice?.token
      headers.set('Content-Type', 'application/json')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    }
  }),
  endpoints: () => ({})
})
