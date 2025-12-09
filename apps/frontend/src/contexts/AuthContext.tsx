import {
  createContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types/User";
import { authService } from "../services/authService";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredData = useCallback(async () => {
    const storedToken = localStorage.getItem("weplan.token");

    if (storedToken) {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (_error) {
        signOut();
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  // Função de Login
  const signIn = async ({ email, password }: any) => {
    const response = await authService.login({ email, password });

    localStorage.setItem("weplan.token", response.token);

    api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

    const userProfile = await authService.getProfile();

    setUser(userProfile);
  };

  const signOut = () => {
    localStorage.removeItem("weplan.token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // Transforma o objeto em booleano (tem user = true)
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
