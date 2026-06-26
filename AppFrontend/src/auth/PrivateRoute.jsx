// src/auth/PrivateRoute.jsx

import React, { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = ({ requiredRole, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Memoize authentication and role check to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => user !== null, [user]);
  const hasRequiredRole = useMemo(() => {
    if (!requiredRole) return true; // If no role is required, allow access
    return user?.role === requiredRole; // Check if user has the required role
  }, [user, requiredRole]);

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect unauthenticated users to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect users who lack the required role with an unauthorized message
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" state={{ message: "You do not have permission to access this page." }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
