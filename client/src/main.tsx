import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import ProfileBooksPage from "./pages/Profile-BooksPage.tsx";
import ProfileReviewPage from "./pages/Profile-ReviewPage.tsx";
import ProfileDiaryPage from "./pages/Profile-DiaryPage.tsx";
import AppLayout from "./AppLayout.tsx";
import { Toaster } from "react-hot-toast";
import OnboardingPage from "./pages/OnboardingPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // NO NAVBAR
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

      // pake NAVBAR
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
        ],
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
    <Toaster />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
