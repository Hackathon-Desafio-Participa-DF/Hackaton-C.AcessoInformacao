import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Gestor } from '../types';
import { authService } from '../services';

interface AuthContextType {
  gestor: Gestor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [gestor, setGestor] = useState<Gestor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedGestor = authService.getStoredGestor();
    if (storedGestor && authService.isAuthenticated()) {
      setGestor(storedGestor);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await authService.login({ email, senha });
    setGestor(response.gestor);
  };

  const logout = () => {
    authService.logout();
    setGestor(null);
  };

  const value: AuthContextType = {
    gestor,
    isAuthenticated: !!gestor,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
