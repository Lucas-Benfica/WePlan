import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { SignIn } from "../pages/SignIn";
import { Dashboard } from "../pages/Dashboard";
import { SignUp } from "../pages/SignUp";
import { PrivateRoute } from "./privateRoute";
import { MyFamilies } from "../pages/MyFamilies";

export const router = createBrowserRouter([
  // Rotas Públicas
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },

  // Rotas Privadas
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <DefaultLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/families",
            element: <MyFamilies />,
          },
        ],
      },
    ],
  },
]);
