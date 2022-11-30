import { Navigate, useLocation } from "react-router-dom";

import { getToken } from "./helpers/storage";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  let token = getToken();
  let location = useLocation();

  if (token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
}
