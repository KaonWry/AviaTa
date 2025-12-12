import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children, storageKey = "aviata-auth" }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const userData = JSON.parse(stored);
          setUser(userData);
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

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      // For now, simulate a successful login
      const userData = {
        id: 1,
        name: email.split("@")[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      };
      
      setUser(userData);
      localStorage.setItem(storageKey, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // TODO: Replace with actual API call
      const userData = {
        id: Date.now(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      };
      
      setUser(userData);
      localStorage.setItem(storageKey, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout, 
        register 
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
