import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getToken } from './helpers/storage'

export const PublicRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const token = getToken()
  const location = useLocation()

  if (token) {
    return <Navigate to="/home" state={{ from: location }} replace />
  }

  return children
}
