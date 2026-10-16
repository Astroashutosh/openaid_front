import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAuthService, type UserProfile } from '../services/userAuthService';

interface UserAuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => userAuthService.getToken());
  const [user, setUser] = useState<UserProfile | null>(() => userAuthService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = userAuthService.getToken();
      if (storedToken) {
        try {
          const profile = await userAuthService.getMe();
          setUser(profile);
          setToken(storedToken);
        } catch {
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await userAuthService.login({ username, password });
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = async () => {
    await userAuthService.logout();
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await userAuthService.getMe();
      setUser(profile);
    } catch {
      // Ignore refresh error
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    refreshProfile,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export default UserAuthContext;
