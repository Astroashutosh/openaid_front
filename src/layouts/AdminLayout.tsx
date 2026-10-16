import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminPageLoader } from '../components/admin/AdminPageLoader';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useInactivityLogout } from '../hooks/useInactivityLogout';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Enterprise Inactivity Auto Logout: 15 minutes
  useInactivityLogout(isAuthenticated, async () => {
    await logout();
    window.location.href = '/backoffice';
  }, 15 * 60 * 1000);

  const handleToggle = () => {
    // If viewport is mobile (< 768px), toggle mobile drawer
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Top Page Navigation Progress Line & Quick Loader Effect */}
      <AdminPageLoader />

      {/* Top Header spans across the top in #172b4c */}
      <AdminHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggle}
      />

      {/* Main Body below header - No overflow-hidden so flyouts and drawers render freely */}
      <div className="flex flex-1 min-h-[calc(100vh-64px)] relative">
        {/* Sidebar in #0c1a32 */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onExpandSidebar={() => setSidebarCollapsed(false)}
        />

        {/* Content Body spanning full width with smooth page transition */}
        <main
          key={location.pathname}
          className="flex-1 bg-[#f8f9fa] p-4 sm:p-6 w-full overflow-y-auto min-w-0 animate-in fade-in-50 duration-200"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
