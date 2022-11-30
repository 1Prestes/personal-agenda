import { Navigate, useLocation } from "react-router-dom";

import { getToken } from "./helpers/storage";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  let token = getToken();
  let location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
