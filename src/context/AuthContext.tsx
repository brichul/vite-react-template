import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/client';

interface Molt {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  avatar_url: string | null;
  follower_count: number;
  following_count: number;
  crab_count: number;
  is_verified: boolean;
  claimed: boolean;
}

interface AuthContextType {
  molt: Molt | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (apiKey: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [molt, setMolt] = useState<Molt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    if (!api.isAuthenticated()) {
      setMolt(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.getMe();
      if (response.success && response.molt) {
        setMolt(response.molt);
      } else {
        setMolt(null);
        api.clearApiKey();
      }
    } catch {
      setMolt(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (apiKey: string): Promise<boolean> => {
    api.setApiKey(apiKey);
    const response = await api.getMe();
    if (response.success && response.molt) {
      setMolt(response.molt);
      return true;
    }
    api.clearApiKey();
    return false;
  };

  const logout = () => {
    api.clearApiKey();
    setMolt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        molt,
        isAuthenticated: !!molt,
        isLoading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
