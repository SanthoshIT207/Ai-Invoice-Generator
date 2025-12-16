import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {

  // ✅ ADD DEBUG LOG HERE (this runs every time AuthProvider loads)
  console.log("DEBUG: AuthProvider mounted");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    // ✅ ADD DEBUG LOG HERE (runs before checking auth)
    console.log("DEBUG: Running checkAuthStatus()");

    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {

    // ✅ ADD DEBUG LOG HERE (log localStorage values)
    console.log("DEBUG: token =", localStorage.getItem("token"));
    console.log("DEBUG: user =", localStorage.getItem("user"));

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr);

        // ✅ LOG WHEN USER IS SET
        console.log("DEBUG: Auth success →", userData);

        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log("DEBUG: No token/user found → Not authenticated");
      }

    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      // ✅ LOG WHEN LOADING IS FINISHED
      console.log("DEBUG: Auth loading finished");
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("DEBUG: Login stored →", userData);

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    console.log("DEBUG: Logged out");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/'
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
