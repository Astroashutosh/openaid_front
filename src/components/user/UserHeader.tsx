import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useUserAuth } from '../../context/UserAuthContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';

interface UserHeaderProps {
  onToggleMobileMenu?: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();
  const { logoUrl, webTitle } = useGeneralSettings();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo matching Laravel Blade */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <img
              src={logoUrl}
              alt={webTitle}
              className="h-9 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            <span className="hidden sm:inline-block font-extrabold text-slate-900 tracking-tight text-lg">
              Open<span className="text-[#ff7a1a]">Aid</span>
            </span>
          </div>
        </div>

        {/* Right Actions: Language Switcher + Account Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Global Google Translate Language Switcher */}
          <LanguageSwitcher theme="light" align="end" />

          {/* 2. Account Dropdown Pill matching Screenshot 1 */}
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => {
                setAccountDropdownOpen(!accountDropdownOpen);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-600" />
              <span>{user?.username || 'Account'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  accountDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Account Menu */}
            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 text-xs font-semibold text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/user/dashboard');
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/user/my-referrals');
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  My Referrals
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/user/genealogy-view');
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  My Team
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/user/profile');
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/user/change-password');
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 hover:text-emerald-700 transition cursor-pointer"
                >
                  Change Password
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to sign out?')) {
                      await logout();
                      navigate('/login');
                    }
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
