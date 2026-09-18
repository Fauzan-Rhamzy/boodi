import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "../index.css";

import App from "./App.tsx";
import AppLayout from "./AppLayout.tsx";

import { AuthProvider } from "./features/auth/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

import GuestRoute from "./components/GuestRoute.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ProtectedAdmin from "./components/ProtectedAdmin.tsx";

import OnboardingPage from "./pages/OnboardingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

import HomePage from "./pages/HomePage.tsx";
import AuthorPage from "./pages/AuthorPage.tsx";
import LibraryPage from "./pages/LibraryPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProfileBooksPage from "./pages/Profile-BooksPage.tsx";
import ProfileReviewPage from "./pages/Profile-ReviewPage.tsx";
import ProfileDiaryPage from "./pages/Profile-DiaryPage.tsx";
import BookDetailPage from "./pages/BookDetailPage.tsx";
import BookReviews from "./pages/BookReviews.tsx";
import SearchResultPage from "./pages/SearchResultPage.tsx";
import LibraryBooksPage from "./pages/LibraryBooksPage.tsx";
import GenrePage from "./pages/GenrePage.tsx";

import AdminHomepage from "./pages/AdminHomepage.tsx";
import BookForm from "./pages/BookForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // =========================
      // PUBLIC ROUTES
      // =========================
      {
        index: true,
        element: <OnboardingPage />,
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },

      // =========================
      // USER ROUTES
      // =========================
      {
        element: <AppLayout />,
        children: [
          {
            path: "author/:id",
            element: (
              <ProtectedRoute>
                <AuthorPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "home",
            element: (
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "library",
            element: (
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <ProfileBooksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile/reviews",
            element: (
              <ProtectedRoute>
                <ProfileReviewPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile/diary",
            element: (
              <ProtectedRoute>
                <ProfileDiaryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile/edit",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "bookDetail/:id",
            element: (
              <ProtectedRoute>
                <BookDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "book/:id/all-reviews",
            element: (
              <ProtectedRoute>
                <BookReviews />
              </ProtectedRoute>
            ),
          },
          {
            path: "search",
            element: (
              <ProtectedRoute>
                <SearchResultPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "currently-reading",
            element: (
              <ProtectedRoute>
                <LibraryBooksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "favourite-books",
            element: (
              <ProtectedRoute>
                <LibraryBooksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "library/:id",
            element: (
              <ProtectedRoute>
                <LibraryBooksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "genre/:id",
            element: (
              <ProtectedRoute>
                <GenrePage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // =========================
      // ADMIN ROUTES
      // =========================
      {
        path: "admin/home",
        element: (
          <ProtectedAdmin>
            <AdminHomepage />
          </ProtectedAdmin>
        ),
      },
      {
        path: "admin/book",
        element: (
          <ProtectedAdmin>
            <BookForm />
          </ProtectedAdmin>
        ),
      },
      {
        path: "admin/book/:bookId",
        element: (
          <ProtectedAdmin>
            <BookForm />
          </ProtectedAdmin>
        ),
      },

      // =========================
      // 404
      // =========================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
