import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService, type AdminUser } from '../services/adminAuthService';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => adminAuthService.getToken());
  const [admin, setAdmin] = useState<AdminUser | null>(() => adminAuthService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = adminAuthService.getToken();
      if (storedToken) {
        try {
          const profile = await adminAuthService.getMe();
          setAdmin(profile);
          setToken(storedToken);
        } catch {
          setAdmin(null);
          setToken(null);
        }
      } else {
        setAdmin(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await adminAuthService.login(username, password);
    if (res.token && res.user) {
      setToken(res.token);
      setAdmin(res.user);
    }
  };

  const logout = async () => {
    await adminAuthService.logout();
    setToken(null);
    setAdmin(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await adminAuthService.getMe();
      setAdmin(profile);
    } catch {
      await logout();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
