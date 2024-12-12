import { useProfileUser } from "@/auth/api/UseAuth";
import { UserData } from "@/types/auth";
import { BlockList } from "net";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isUser: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialAuthState = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    getInitialAuthState()
  );
  const {
    data: user,
    isAdmin,
    isUser,
    isLoading,
    isError,
    error,
  } = useProfileUser();
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user) {
      setIsAuthenticated(true);
    } else if (!isLoading && (isError || !user)) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  }, [user, isLoading, isError]);

  const isInitialLoading = isAuthenticated && isLoading;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading: isInitialLoading,
        error: error || null,
        isAdmin,
        isUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
