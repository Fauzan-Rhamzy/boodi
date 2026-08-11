import type React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { Navigate } from "react-router";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode | null;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) return <Navigate to={"/home"} replace />;

  return <>{children}</>;
}
