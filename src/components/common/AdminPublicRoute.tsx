import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminPublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03150D] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-[#D4A72C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    // If already authenticated as admin, redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
