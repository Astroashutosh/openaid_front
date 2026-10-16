import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

export const UserPublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useUserAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03150D] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-[#D4A72C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};
