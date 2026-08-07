// Holds the current user in memory for the whole app, and figures out on
// first load whether the browser already has a valid session cookie (e.g.
// the user refreshed the page after logging in yesterday).

import { createContext, useEffect, useState, useCallback } from "react";
import { fetchCurrentUser, logout as logoutRequest } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
