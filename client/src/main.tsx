import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import AuthorPage from "./pages/AuthorPage.tsx";
import "../index.css";
import App from "./App.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LibraryPage from "./pages/LibraryPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import BookDetailPage from "./pages/BookDetailPage.tsx";
import SearchResultPage from "./pages/SearchResultPage.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
import GuestRoute from "./components/GuestRoute.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LibraryBooksPage from "./pages/LibraryBooksPage.tsx";

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
        path: "/author/:id",
        element: (
          <ProtectedRoute>
            <AuthorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/library",
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bookDetail/:id",
        element: (
          <ProtectedRoute>
            <BookDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/library/:id",
        element: (
          <ProtectedRoute>
            <LibraryBooksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
