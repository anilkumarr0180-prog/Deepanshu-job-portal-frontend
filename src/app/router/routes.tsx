import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "@/shared/layouts";

import HomePage from "@/features/home/pages/HomePage";
import JobsPage from "@/features/jobs/pages/JobsPage";
import JobDetailsPage from "@/features/jobs/pages/JobDetailsPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/:id",
        element: <JobDetailsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
];