import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import AuthorPage from "./pages/AuthorPage.tsx";
import "../index.css";
import App from "./App.tsx";
import LoginPage from "./pages/LoginPage.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/author', 
        element: <AuthorPage />,
      }, 
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
