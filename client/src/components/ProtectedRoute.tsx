import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  role?: "volunteer" | "organization" | "admin";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/authentication" replace />;
  }

  // If route requires specific role, but user has different role → deny access
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return children;
}
