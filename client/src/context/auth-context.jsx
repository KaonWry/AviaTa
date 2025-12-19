/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";


const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children, storageKey = "aviata-auth" }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();


  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const userData = JSON.parse(stored);
          const rawId = userData?.id;
          const numericId = Number.parseInt(String(rawId), 10);
          // Older app versions sometimes stored `id` as an email string.
          // This app now requires numeric user ids for profile/booking APIs.
          if (Number.isFinite(numericId) && String(rawId).trim() !== "") {
            setUser({ ...userData, id: numericId });
          } else {
            localStorage.removeItem(storageKey);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem(storageKey);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [storageKey]);

  const updateUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(storageKey, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Login gagal." };
      }
      if (!data.user) {
        return { success: false, error: "Gagal mengambil data user." };
      }
      updateUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, passwordConfirm) => {
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, passwordConfirm })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Registrasi gagal." };
      }
      if (!data.user) {
        return { success: false, error: "Gagal mengambil data user." };
      }
      updateUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    updateUser(null);
    // navigate("/");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout, 
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
