import {
  createBrowserRouter,
} from "react-router-dom";

import { SignIn } from './pages/SignIn';

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SignIn />
    ),
  },
]);
