import React, { useState, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UserHeader } from '../components/user/UserHeader';
import { UserSidebar } from '../components/user/UserSidebar';
import { useUserAuth } from '../context/UserAuthContext';
import { useInactivityLogout } from '../hooks/useInactivityLogout';

export const UserLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useUserAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if session was launched from Admin "Login as User" impersonation
  const [isImpersonating, setIsImpersonating] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('impersonate_admin_token'));
  });

  // Scroll to top smoothly on every page navigation
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsImpersonating(Boolean(localStorage.getItem('impersonate_admin_token')));
  }, [location.pathname]);

  // Exit Impersonation: restore admin credentials, clear user session, redirect to admin backoffice
  const handleExitImpersonation = () => {
    // 1. Destroy user session
    localStorage.removeItem('user_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user');
    localStorage.removeItem('user_login_time');

    // 2. Restore saved admin session
    const adminToken = localStorage.getItem('impersonate_admin_token');
    const adminUser = localStorage.getItem('impersonate_admin_user');
    const returnUrl =
      localStorage.getItem('impersonate_admin_return_url') || '/admin/members/active';

    if (adminToken) {
      localStorage.setItem('admin_token', adminToken);
    }
    if (adminUser) {
      localStorage.setItem('admin_user', adminUser);
    }
    localStorage.setItem('admin_login_time', Date.now().toString());

    // 3. Clear impersonate snapshot markers
    localStorage.removeItem('impersonate_admin_token');
    localStorage.removeItem('impersonate_admin_user');
    localStorage.removeItem('impersonate_admin_return_url');

    // 4. Same window redirect to admin backoffice
    window.location.href = returnUrl;
  };

  // Enterprise Inactivity Auto Logout: 15 minutes (only when NOT impersonating)
  useInactivityLogout(isAuthenticated && !isImpersonating, async () => {
    await logout();
    window.location.href = '/login';
  }, 15 * 60 * 1000);

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#ff7a1a] selection:text-white">
      {/* 0. Admin Impersonation Sticky Banner (Matching Screenshot 2 & Laravel app.blade.php) */}
      {isImpersonating && (
        <div className="bg-[#dc3545] text-white py-1.5 px-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium sticky top-0 z-[99999] shadow-md">
          <div className="flex items-center gap-1.5 text-center">
            <span className="font-bold">⚠ Admin Impersonation Mode Active!</span>
            <span>You are currently logged in as a user.</span>
          </div>
          <button
            type="button"
            onClick={handleExitImpersonation}
            className="bg-[#082019] hover:bg-black text-white text-xs font-semibold px-3 py-0.5 rounded-full border border-white/20 transition-all shadow-sm cursor-pointer ml-2"
          >
            Exit
          </button>
        </div>
      )}

      <UserHeader
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />


      {/* 2. Main Body with Floating Sidebar + Dynamic Content Outlet */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex gap-6 items-start">
        {/* Member Sidebar */}
        <UserSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          currentUser={{
            name: user?.full_name || user?.username || 'Member',
            username: user?.username || '',
            rank: user?.rank_id ? `RANK ${user.rank_id}` : 'MEMBER',
            isActive: user?.status === 1,
            creditsCount: 0,
            unclaimedRewardsCount: 0,
          }}
        />

        {/* Content Body */}
        <main className="flex-1 min-w-0 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="bg-[#082019] text-white/70 border-t border-white/10 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-medium text-white/90">
              Copyright &copy; {new Date().getFullYear()}{' '}
              <span className="text-[#ff7a1a] font-bold">OpenAid International</span>. All rights reserved.
            </p>
            <p className="text-[11px] text-white/50 mt-0.5">
              Sequential 2:1 FIFO Matching Protocol • Helping Community
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/60">
            <a href="/terms" className="hover:text-white transition">Terms &amp; Conditions</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="/support" className="hover:text-white transition">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
