import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  role?: "volunteer" | "organization" | "admin";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/authentication" replace />;
  }

  // Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
