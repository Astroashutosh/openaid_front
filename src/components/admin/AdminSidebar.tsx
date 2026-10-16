import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Monitor,
  Package,
  CreditCard,
  Users,
  Download,
  Award,
  DollarSign,
  ShoppingCart,
  BarChart2,
  Calendar,
  BookOpen,
  Image,
  Bell,
  LifeBuoy,
  FileText,
  Settings,
  Lock,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onExpandSidebar?: () => void;
}

interface MenuItemChild {
  title: string;
  path: string;
  badge?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  badge?: { count: number; color: string };
  children?: MenuItemChild[];
  onClick?: () => void;
  isAction?: boolean;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
  onExpandSidebar,
}) => {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const { logoUrl, webTitle } = useGeneralSettings();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      window.location.href = '/backoffice';
    }
  };

  // Dynamic sidebar badge counters matching Laravel sidebar.blade.php
  const [sidebarCounters, setSidebarCounters] = useState({
    rankRewardsCount: 0,
    pendingDepositsCount: 0,
    pendingWithdrawalsCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchCounters = async () => {
      try {
        const res = await apiClient.get<{
          success: boolean;
          data: { rankRewardsCount: number; pendingDepositsCount: number; pendingWithdrawalsCount: number };
        }>('/admin/dashboard/sidebar-counters', { authScope: 'admin' });
        if (isMounted && res.success && res.data) {
          setSidebarCounters(res.data);
        }
      } catch {
        // Silently ignore background polling failure
      }
    };

    fetchCounters();
    const interval = setInterval(fetchCounters, 15000); // refresh every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  // Navigation Items matching 100% with Laravel sidebar.blade.php
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Monitor,
      path: '/admin',
    },
    {
      id: 'packages',
      title: 'Packages',
      icon: Package,
      children: [
        { title: 'Donations Packages', path: '/admin/packages/donations' },
        { title: 'Credit Packages', path: '/admin/packages/credits' },
      ],
    },
    {
      id: 'credits',
      title: 'Credits',
      icon: CreditCard,
      children: [
        { title: 'Generated Credits', path: '/admin/credits/generated' },
        { title: 'Credit Transfer', path: '/admin/credits/transfer' },
        { title: 'Used Credits', path: '/admin/credits/used' },
      ],
    },
    {
      id: 'members',
      title: 'Members',
      icon: Users,
      children: [
        { title: 'Active Members', path: '/admin/members/active' },
        { title: 'Inactive Members', path: '/admin/members/inactive' },
        { title: 'Blocked Members', path: '/admin/members/blocked' },
        { title: 'Suspended Members', path: '/admin/members/suspended' },
      ],
    },
    {
      id: 'deposits',
      title: 'Donate Now',
      icon: Download,
      badge:
        sidebarCounters.pendingDepositsCount > 0
          ? { count: sidebarCounters.pendingDepositsCount, color: 'bg-[#ffa800] text-slate-950 font-bold' }
          : undefined,
      children: [
        {
          title: 'Pending Donate',
          path: '/admin/deposits/pending',
          badge:
            sidebarCounters.pendingDepositsCount > 0
              ? String(sidebarCounters.pendingDepositsCount)
              : undefined,
        },
        { title: 'All Donate Log', path: '/admin/deposits/all' },
      ],
    },
    {
      id: 'rankRewards',
      title: 'Rank Rewards',
      icon: Award,
      badge:
        sidebarCounters.rankRewardsCount > 0
          ? { count: sidebarCounters.rankRewardsCount, color: 'bg-[#ffa800] text-slate-950 font-bold' }
          : undefined,
      children: [
        {
          title: 'Claim Requests',
          path: '/admin/rank-rewards/pending',
          badge:
            sidebarCounters.rankRewardsCount > 0
              ? String(sidebarCounters.rankRewardsCount)
              : undefined,
        },
        { title: 'Unclaimed Rewards', path: '/admin/rank-rewards/unclaimed' },
        { title: 'Approved Requests', path: '/admin/rank-rewards/approved' },
        { title: 'Rejection Audit Log', path: '/admin/rank-rewards/rejected' },
      ],
    },
    {
      id: 'withdrawals',
      title: 'Withdrawals',
      icon: DollarSign,
      badge:
        sidebarCounters.pendingWithdrawalsCount > 0
          ? { count: sidebarCounters.pendingWithdrawalsCount, color: 'bg-rose-500 text-white font-bold' }
          : undefined,
      children: [
        {
          title: 'Pending Withdrawals',
          path: '/admin/withdrawals/pending',
          badge:
            sidebarCounters.pendingWithdrawalsCount > 0
              ? String(sidebarCounters.pendingWithdrawalsCount)
              : undefined,
        },
        { title: 'Withdrawal History', path: '/admin/withdrawals/history' },
      ],
    },
    {
      id: 'purchaseDonation',
      title: 'Purchase & Donation',
      icon: ShoppingCart,
      children: [
        { title: 'Credit Purchase', path: '/admin/purchase-donation/credit-purchases' },
        { title: 'Make Donation', path: '/admin/purchase-donation/donations' },
      ],
    },
    {
      id: 'reports',
      title: 'Reports & Bonuses',
      icon: BarChart2,
      children: [
        { title: 'Referral Commission', path: '/admin/reports/referral' },
        { title: 'Level Commission', path: '/admin/reports/level' },
        { title: 'Rank Reward', path: '/admin/reports/rank-reward' },
        { title: '1% Protocol Fee', path: '/admin/reports/protocol-fee' },
        { title: 'All Transactions', path: '/admin/reports/transactions' },
      ],
    },
    {
      id: 'weeklyReport',
      title: 'Weekly Report',
      icon: Calendar,
      path: '/admin/weekly-report',
    },
    {
      id: 'academy',
      title: 'OpenAid Academy',
      icon: BookOpen,
      children: [
        { title: 'Course Categories', path: '/admin/academy/categories' },
        { title: 'All Courses', path: '/admin/academy/courses' },
        // { title: 'Course Purchases', path: '/admin/academy/purchases' },
      ],
    },
    {
      id: 'banners',
      title: 'Banner Slider',
      icon: Image,
      path: '/admin/banners',
    },
    {
      id: 'announcements',
      title: 'Announcements',
      icon: Bell,
      children: [
        { title: 'All Announcements', path: '/admin/announcements' },
        { title: 'Send Announcement', path: '/admin/announcements/create' },
      ],
    },
    {
      id: 'support',
      title: 'Support Tickets',
      icon: LifeBuoy,
      children: [
        { title: 'All Tickets', path: '/admin/support' },
        { title: 'Open', path: '/admin/support/open' },
        { title: 'In Progress', path: '/admin/support/answered' },
        { title: 'Waiting For User', path: '/admin/support/customer-reply' },
        { title: 'Resolved', path: '/admin/support/resolved' },
        { title: 'Closed', path: '/admin/support/closed' },
      ],
    },
    {
      id: 'businessMaterial',
      title: 'Business Material',
      icon: FileText,
      path: '/admin/business-material',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'General Settings', path: '/admin/settings/general' },
        { title: 'Charge & Limits', path: '/admin/settings/charges' },
        { title: 'Rank Setting', path: '/admin/settings/ranks' },
        { title: 'Level Commission', path: '/admin/settings/levels' },
        { title: 'Payment Setting', path: '/admin/settings/payment' },
      ],
    },
    {
      id: 'changePassword',
      title: 'Change Password',
      icon: Lock,
      path: '/admin/change-password',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: LogOut,
      onClick: handleLogout,
      isAction: true,
    },
  ];

  // Accordion state for expanded sidebar
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.children) {
        initial[item.id] = item.children.some((c) => location.pathname.startsWith(c.path));
      }
    });
    return initial;
  });

  // Floating popover state for collapsed desktop mode
  interface FlyoutState {
    item: MenuItem;
    top: number;
    left: number;
  }
  const [flyout, setFlyout] = useState<FlyoutState | null>(null);
  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close flyout on window scroll
  useEffect(() => {
    const handleScroll = () => setFlyout(null);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    };
  }, []);

  const desktopSidebarRef = useRef<HTMLElement | null>(null);

  const handleMouseEnterItem = (item: MenuItem, e: React.MouseEvent<HTMLElement>) => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    if (collapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const sidebarRight = desktopSidebarRef.current
        ? desktopSidebarRef.current.getBoundingClientRect().right
        : rect.right;
      const flyoutHeight = (item.children?.length || 1) * 38 + 48;
      let top = rect.top;
      // Prevent popover from extending below window
      if (top + flyoutHeight > window.innerHeight - 16) {
        top = Math.max(70, window.innerHeight - flyoutHeight - 16);
      }
      setFlyout({
        item,
        top,
        left: sidebarRight + 4,
      });
    }
  };

  const handleMouseLeaveItem = () => {
    if (collapsed) {
      flyoutTimerRef.current = setTimeout(() => {
        setFlyout(null);
      }, 200);
    }
  };

  const toggleAccordion = (id: string) => {
    if (collapsed && onExpandSidebar) {
      onExpandSidebar();
      setOpenMenus((prev) => ({ ...prev, [id]: true }));
      return;
    }
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemActive = (item: MenuItem) => {
    if (item.path) {
      return item.path === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(item.path);
    }
    if (item.children) {
      return item.children.some((c) => location.pathname.startsWith(c.path));
    }
    return false;
  };

  // Reusable Menu List Component
  const renderNavList = (isMobileDrawer: boolean) => {
    const isCollapsedMode = collapsed && !isMobileDrawer;

    return (
      <div className={`py-2 space-y-1.5 ${isCollapsedMode ? 'px-2' : 'px-2.5'}`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isItemActive(item);
          const isOpen = !!openMenus[item.id];

          // 1. Action button item (e.g. Logout directly matching Laravel sidebar.blade.php)
          if (item.onClick || item.isAction) {
            return (
              <div
                key={item.id}
                className={`relative ${isCollapsedMode ? 'flex justify-center' : ''}`}
                onMouseEnter={(e) => !isMobileDrawer && handleMouseEnterItem(item, e)}
                onMouseLeave={() => !isMobileDrawer && handleMouseLeaveItem()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFlyout(null);
                    if (isMobileDrawer && onCloseMobile) onCloseMobile();
                    item.onClick?.();
                  }}
                  className={
                    isCollapsedMode
                      ? 'w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer text-[#8a99b5] hover:text-rose-400 hover:bg-rose-500/10'
                      : 'w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all font-medium text-sm sm:text-base text-[#8a99b5] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer text-left'
                  }
                  title={isCollapsedMode ? item.title : undefined}
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  {!isCollapsedMode && <span className="truncate">{item.title}</span>}
                </button>
              </div>
            );
          }

          // 2. Single direct link (e.g. Dashboard, Weekly Report, Banners, Announcements, Security)
          if (!item.children && item.path) {
            return (
              <div
                key={item.id}
                className={`relative ${isCollapsedMode ? 'flex justify-center' : ''}`}
                onMouseEnter={(e) => !isMobileDrawer && handleMouseEnterItem(item, e)}
                onMouseLeave={() => !isMobileDrawer && handleMouseLeaveItem()}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => {
                    setFlyout(null);
                    if (isMobileDrawer && onCloseMobile) onCloseMobile();
                  }}
                  className={({ isActive }) =>
                    isCollapsedMode
                      ? `w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'text-[#ffa800] font-bold bg-white/10 shadow-sm'
                            : 'text-[#8a99b5] hover:text-white hover:bg-white/5'
                        }`
                      : `flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all font-medium text-sm sm:text-base ${
                          isActive
                            ? 'text-[#ffa800] font-bold bg-white/10 shadow-sm'
                            : 'text-[#8a99b5] hover:text-white hover:bg-white/5'
                        }`
                  }
                  title={isCollapsedMode ? item.title : undefined}
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  {!isCollapsedMode && <span className="truncate">{item.title}</span>}
                </NavLink>
              </div>
            );
          }

          // 2. Dropdown item with children (e.g. Packages, Credits, Members, etc.)
          return (
            <div
              key={item.id}
              className={`relative ${isCollapsedMode ? 'flex justify-center' : ''}`}
              onMouseEnter={(e) => !isMobileDrawer && handleMouseEnterItem(item, e)}
              onMouseLeave={() => !isMobileDrawer && handleMouseLeaveItem()}
            >
              {/* Header Accordion Button */}
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className={
                  isCollapsedMode
                    ? `w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        active
                          ? 'text-[#ffa800] font-bold bg-white/10'
                          : 'text-[#8a99b5] hover:text-white hover:bg-white/5'
                      }`
                    : `w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all font-medium text-sm sm:text-base cursor-pointer ${
                        active
                          ? 'text-[#ffa800] font-bold bg-white/10'
                          : 'text-[#8a99b5] hover:text-white hover:bg-white/5'
                      }`
                }
              >
                {isCollapsedMode ? (
                  <IconComponent className="w-5 h-5 shrink-0" />
                ) : (
                  <>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <IconComponent className="w-5 h-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black ${item.badge.color}`}>
                          {item.badge.count}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform opacity-70 ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </>
                )}
              </button>

              {/* Accordion Submenu (when expanded in desktop or in mobile drawer) */}
              {!isCollapsedMode && isOpen && item.children && (
                <div className="pl-6 pr-2 py-1.5 space-y-1 border-l-2 border-white/10 ml-5 my-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => {
                        if (isMobileDrawer && onCloseMobile) onCloseMobile();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-all font-medium ${
                          isActive
                            ? 'text-[#ffa800] font-bold bg-white/10'
                            : 'text-[#8a99b5] hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <span>• {child.title}</span>
                      {child.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ffa800] text-slate-950">
                          {child.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 1. MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 2. MOBILE DRAWER (< md:) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-[#0c1a32] text-[#8a99b5] shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header with Close Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-[#0c1a32]">
          <div className="flex items-center gap-2.5">
            <div className="h-10 flex items-center max-w-[170px]">
              <img
                src={logoUrl}
                alt={webTitle}
                className="h-8 w-auto max-w-[150px] object-contain"
                style={{
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  imageRendering: '-webkit-optimize-contrast',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="text-white font-bold text-sm tracking-wide">Menu</span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Scrollable menu content for mobile */}
        <div className="flex-1 overflow-y-auto">
          {renderNavList(true)}
        </div>
      </aside>

      {/* 3. DESKTOP SIDEBAR (>= md:) */}
      <aside
        ref={desktopSidebarRef}
        className={`hidden md:flex flex-col bg-[#0c1a32] text-[#8a99b5] sticky top-16 h-[calc(100vh-64px)] z-30 transition-all duration-300 border-r border-white/5 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Scrollable Nav Menu Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderNavList(false)}
        </div>

        {/* Bottom Expand/Collapse Quick Toggle */}
        {collapsed && onExpandSidebar && (
          <div className="p-3 border-t border-white/10 text-center flex justify-center">
            <button
              type="button"
              onClick={onExpandSidebar}
              className="w-12 h-10 flex items-center justify-center text-[#ffa800] hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* 4. FLOATING FLYOUT SUBMENU IN COLLAPSED MODE (Matching Laravel blade hover popup) */}
      {collapsed && flyout && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: flyout.top,
            left: flyout.left,
            zIndex: 99999,
          }}
          onMouseEnter={() => {
            if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
          }}
          onMouseLeave={handleMouseLeaveItem}
          className="w-60 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-slate-200/90 py-2 animate-in fade-in zoom-in-95 duration-100 select-none pointer-events-auto"
        >
          {/* Invisible hit-area bridge to seamlessly catch mouse movements from sidebar icon */}
          <div className="absolute -left-4 top-0 bottom-0 w-4 bg-transparent" />

          {flyout.item.children ? (
            <div>
              {/* Menu Title Header inside Floating Card */}
              <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs tracking-wide">
                  {flyout.item.title}
                </span>
                {flyout.item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${flyout.item.badge.color}`}>
                    {flyout.item.badge.count}
                  </span>
                )}
              </div>

              {/* Submenu links with Laravel icon-Commit (-o-) bullet indicator */}
              <div className="space-y-0.5 px-1.5">
                {flyout.item.children.map((child) => {
                  const isChildActive = location.pathname.startsWith(child.path);
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => setFlyout(null)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isChildActive
                          ? 'text-[#ffa800] bg-amber-50 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {/* Commit bullet icon (-o-) exactly matching Laravel icon-Commit */}
                      <span className="flex items-center text-slate-300 shrink-0">
                        <span className="w-2.5 h-[1.5px] bg-slate-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full border border-slate-300 bg-white"></span>
                        <span className="w-2.5 h-[1.5px] bg-slate-300"></span>
                      </span>

                      <span className="truncate">{child.title}</span>

                      {child.badge && (
                        <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-black bg-[#ffa800] text-slate-950">
                          {child.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ) : flyout.item.onClick || flyout.item.isAction ? (
            /* Action Button Tooltip (e.g. Logout) */
            <div className="px-2">
              <button
                type="button"
                onClick={() => {
                  setFlyout(null);
                  flyout.item.onClick?.();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-left cursor-pointer"
              >
                <span>{flyout.item.title}</span>
              </button>
            </div>
          ) : (
            /* Single Direct Link Tooltip */
            <div className="px-2">
              <NavLink
                to={flyout.item.path!}
                onClick={() => setFlyout(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  location.pathname === flyout.item.path
                    ? 'text-[#ffa800] bg-amber-50 font-bold'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span>{flyout.item.title}</span>
              </NavLink>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
