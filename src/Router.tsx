import {
  createBrowserRouter,
} from "react-router-dom";

import { SignIn } from './pages/SignIn';
import { Home } from "./pages/Home";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SignIn />
    ),
  },
  {
    path: "/home",
    element: (
      <Home />
    ),
  },
]);
