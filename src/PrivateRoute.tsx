import { Navigate, useLocation } from 'react-router-dom'

import { getToken } from './helpers/storage'

export const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const token = getToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
