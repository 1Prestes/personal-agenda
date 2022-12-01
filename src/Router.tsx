import {
  createBrowserRouter,
} from "react-router-dom";

import { SignIn } from './pages/SignIn';
import { Home } from "./pages/Home";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { SignUp } from "./pages/SignUp";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/inscrever-se",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
]);
