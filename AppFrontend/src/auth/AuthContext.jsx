// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../api/api";

// Create and export AuthContext for global authentication state
export const AuthContext = createContext();

// AuthProvider manages user authentication flows
export const AuthProvider = ({ children }) => {
  // user: holds authenticated user data
  const [user, setUser] = useState(null);
  // authToken: holds the current token, initialized from localStorage
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  // loading: tracks async operations related to authentication
  const [loading, setLoading] = useState(true);

  // When authToken changes, verify it and update user state
  useEffect(() => {

    if (authToken && localStorage.getItem("user")) {
      verifyToken(authToken);
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // verifyToken: verifies the token via backend and sets the user state
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/verify-token`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      // IMPORTANT: fetch() does NOT throw on HTTP errors (401, 500, etc.)
      // We must check response.ok explicitly
      if (!response.ok) {
        throw new Error(`Token verification failed with status ${response.status}`);
      }
      // If verification is successful, set the user state from localStorage
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch (error) {
      console.error("Token verification failed, logging out:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // login: calls API to log in and saves tokens and user info in both localStorage and state
  const login = async (userData) => {
    try {
      const { user, token, refreshToken } = await loginUser(userData);
      setUser(user);
      setAuthToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error) {

      throw error;
    }
  };

  // register: registers a new user
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      return response.data;
    } catch (error) {

      throw error;
    }
  };

  // refreshAccessToken: refreshes the token using the stored refreshToken
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      setAuthToken(data.newToken);
      localStorage.setItem("authToken", data.newToken);
      return data.newToken;
    } catch (error) {
      console.error("Token refresh failed, logging out:", error);
      logout();
    }
  }, []);

  // logout: clears authentication-related storage and resets state
  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        userRole: user?.role,
        authToken,
        login,
        register,
        logout,
        loading,
        refreshAccessToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
