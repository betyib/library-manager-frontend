import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // to track loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false); // done loading
  }, []);

  const loginUser = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);

    setToken(data.access_token);
    setUser(data.user);
    setRole(data.user.role);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, loginUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
