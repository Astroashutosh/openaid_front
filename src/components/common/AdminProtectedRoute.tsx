import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03150D] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-[#D4A72C] border-t-transparent rounded-full animate-spin" />
        <span className="mt-4 text-sm font-semibold text-[#D4A72C] tracking-widest uppercase">
          Verifying Admin Access...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to Laravel backoffice url pattern
    return <Navigate to="/backoffice" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
