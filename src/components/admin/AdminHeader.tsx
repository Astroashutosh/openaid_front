import React, { useState, useRef, useEffect } from 'react';
import { Menu, Maximize, User, ShieldCheck, Key, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const AdminHeader: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { admin, logout } = useAdminAuth();
  const { logoUrl, faviconUrl, webTitle } = useGeneralSettings();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-16 bg-[#172b4c] border-b border-white/10 flex items-center justify-between sticky top-0 z-40 text-white select-none shadow-md">
      {/* Left side: Logo Box + Hamburger Toggle */}
      <div className="flex items-center h-full min-w-0">
        {/* Brand Logo Box: Perfectly aligned with desktop sidebar background (#0c1a32) and width */}
        <div
          className={`h-full flex items-center px-4 bg-[#0c1a32] border-r border-white/10 transition-all duration-300 shrink-0 ${
            sidebarCollapsed ? 'md:w-20 md:justify-center' : 'md:w-64 md:justify-start'
          }`}
        >
          <NavLink
            to="/admin"
            className="flex items-center group transition-transform duration-200 active:scale-95"
            title={webTitle}
          >
            {sidebarCollapsed ? (
              /* Collapsed Mode (80px): Clean Square App Icon / Favicon */
              <div className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all group-hover:scale-105">
                <img
                  src={faviconUrl}
                  alt={webTitle}
                  className="w-7 h-7 object-contain transition-all"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                  onError={(e) => {
                    // Fallback to logoUrl if favicon fails
                    (e.currentTarget as HTMLImageElement).src = logoUrl;
                  }}
                />
              </div>
            ) : (
              /* Expanded Mode: High-Definition, Theme-Integrated Brand Logo */
              <div className="h-11 flex items-center transition-all group-hover:opacity-90 max-w-[210px]">
                <img
                  src={logoUrl}
                  alt={webTitle}
                  className="h-10 w-auto max-w-[195px] object-contain transition-all"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const span = document.createElement('span');
                      span.className = 'fallback-text font-black text-lg text-white tracking-wide';
                      span.innerText = webTitle || 'OpenAid';
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            )}
          </NavLink>
        </div>

        {/* Sidebar Toggle Hamburger Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="ml-2 sm:ml-3 p-2.5 rounded-lg text-[#ffa800] hover:bg-white/10 active:bg-white/20 transition flex items-center justify-center focus:outline-none cursor-pointer"
          title="Toggle Navigation Menu"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6 text-[#ffa800]" />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3 pr-3 sm:pr-6 shrink-0">
        {/* Fullscreen Button with Gold outline */}
        <button
          type="button"
          onClick={toggleFullScreen}
          className="p-2 rounded-lg border border-white/20 text-[#ffa800] hover:bg-white/10 transition hidden sm:flex items-center justify-center cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Global Google Translate Language Selector matching Image 1 */}
        <LanguageSwitcher theme="admin" align="end" />

        {/* Admin profile user menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-[#ffa800] hover:bg-white/20 cursor-pointer transition focus:outline-none"
            aria-label="Admin Profile Menu"
          >
            <User className="w-5 h-5" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0c1a32] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 text-sm">
              <div className="px-4 py-2.5 border-b border-white/10">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ffa800]" />
                  <span>{admin?.first_name || admin?.username || 'Administrator'}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{admin?.email || 'admin@openaid.org'}</div>
              </div>

              <div className="py-1">
                <NavLink
                  to="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Update Profile</span>
                </NavLink>

                <NavLink
                  to="/admin/change-password"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>Change Password</span>
                </NavLink>
              </div>

              <div className="pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={async () => {
                    setUserMenuOpen(false);
                    await logout();
                    window.location.href = '/backoffice';
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};
