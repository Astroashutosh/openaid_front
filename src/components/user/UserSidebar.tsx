import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  Repeat,
  CreditCard,
  Users,
  ArrowUpCircle,
  TrendingUp,
  Award,
  GraduationCap,
  Coins,
  Store,
  Bot,
  Newspaper,
  Briefcase,
  HelpCircle,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';

interface UserSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  currentUser?: {
    name: string;
    username: string;
    rank: string;
    isActive: boolean;
    creditsCount?: number;
    unclaimedRewardsCount?: number;
  };
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
  currentUser = {
    name: 'Samuel Ozor',
    username: 'OAI798249',
    rank: 'NO RANK',
    isActive: true,
    creditsCount: 0,
    unclaimedRewardsCount: 0,
  },
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserAuth();

  // Accordion state for dropdown items
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    donate: location.pathname.includes('/deposit') || location.pathname.includes('/donate'),
    fifo: location.pathname.includes('/donation') || location.pathname.includes('/queue') || location.pathname.includes('/recommit'),
    credits: location.pathname.includes('/epin') || location.pathname.includes('/credit'),
    network: location.pathname.includes('/referral') || location.pathname.includes('/genealogy'),
    withdraw: location.pathname.includes('/withdraw') || location.pathname.includes('/transfer-to-deposit'),
    earnings: location.pathname.includes('/income') || location.pathname.includes('/transaction') || location.pathname.includes('/earnings'),
    ranks: location.pathname.includes('/rank') || location.pathname.includes('/claim'),
    academy: location.pathname.includes('/academy'),
    account: location.pathname.includes('/profile') || location.pathname.includes('/password') || location.pathname.includes('/wallet-address'),
  });

  const toggleAccordion = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
      isActive
        ? 'bg-gradient-to-r from-[#ff7a1a]/25 to-[#ff7a1a]/5 text-[#ff7a1a] border-l-4 border-[#ff7a1a] font-bold shadow-xs'
        : 'text-white/80 hover:text-white hover:bg-white/5'
    }`;

  const submenuItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between py-2 px-3 rounded-lg text-xs transition cursor-pointer ${
      isActive
        ? 'text-[#ff7a1a] font-bold bg-white/10'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0c2c23] text-white">
      {/* 1. Member Profile Card (Matching Laravel sidebar.blade.php lines 45-67) */}
      <div className="p-4 border-b border-white/10 bg-[#082019]">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#0e3228] to-[#ff7a1a] shadow-lg border border-white/15 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center font-extrabold text-base text-white shadow-inner shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
            <div className="text-[11px] text-white/90 truncate">
              ID: <strong className="text-white font-mono">{currentUser.username}</strong>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-white bg-black/25 px-2 py-0.5 rounded-md">
                ⭐ {currentUser.rank}
              </span>
              {currentUser.isActive ? (
                <span className="text-[9px] font-extrabold uppercase text-white bg-[#16a34a] px-2 py-0.5 rounded-md shadow-xs">
                  Active Donor
                </span>
              ) : (
                <span className="text-[9px] font-extrabold uppercase text-white bg-rose-600 px-2 py-0.5 rounded-md shadow-xs">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
        {/* 1. Dashboard */}
        <NavLink
          to="/user/dashboard"
          end
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-[#ff7a1a]" />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* 2. My Wallet */}
        <NavLink
          to="/user/my-wallet"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>My Wallet</span>
          </div>
        </NavLink>

        {/* 3. Donate Now (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('donate')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="w-4 h-4 text-amber-400" />
              <span>Donate Now</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.donate ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.donate && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/deposit-fund"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Instant Donate</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Web3
                </span>
              </NavLink>
              <NavLink
                to="/user/deposit/history"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Donate History</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. FIFO (Donations Queue Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('fifo')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Repeat className="w-4 h-4 text-sky-400" />
              <span>FIFO Protocol</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.fifo ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.fifo && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/make-donation"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Make Donation (MD)</span>
              </NavLink>
              <NavLink
                to="/user/receive-donation"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Receive Donation (RD)</span>
              </NavLink>
              <NavLink
                to="/user/send-donations"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Send Donations</span>
              </NavLink>
              <NavLink
                to="/user/live-queue-tracker"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Queue Tracker</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                  LIVE
                </span>
              </NavLink>
              <NavLink
                to="/user/recommitment"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Recommitment Policy</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 5. Credits System (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('credits')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>Credits System</span>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.creditsCount !== undefined && currentUser.creditsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#ff7a1a] text-slate-950">
                  {currentUser.creditsCount}
                </span>
              )}
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                  openMenus.credits ? 'rotate-90' : ''
                }`}
              />
            </div>
          </button>
          {openMenus.credits && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/my-epins"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• My Credits</span>
              </NavLink>
              <NavLink
                to="/user/buy-epins"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Buy Credit</span>
              </NavLink>
              <NavLink
                to="/user/transfer-epin"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Transfer Credit</span>
              </NavLink>
              <NavLink
                to="/user/my-purchased-epins"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• My Purchased</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 6. My Network (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('network')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>My Network</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.network ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.network && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/my-referrals"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Direct Referrals</span>
              </NavLink>
              <NavLink
                to="/user/genealogy-view"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Genealogy Tree</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 7. Withdrawals (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('withdraw')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ArrowUpCircle className="w-4 h-4 text-rose-400" />
              <span>Withdrawals</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.withdraw ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.withdraw && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/withdraw-usdt"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Withdraw Fund</span>
              </NavLink>
              <NavLink
                to="/user/withdrawal-report"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Withdraw History</span>
              </NavLink>
              <NavLink
                to="/user/transfer-to-deposit"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Transfer to Donate</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 8. Earnings (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('earnings')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Earnings</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.earnings ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.earnings && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/referral-income"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Referral Commission</span>
              </NavLink>
              <NavLink
                to="/user/level-income"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Level Commission</span>
              </NavLink>
              <NavLink
                to="/user/donation-earnings"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Donation Earnings</span>
              </NavLink>
              <NavLink
                to="/user/transactions"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• All Transactions</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 9. Rank Rewards (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('ranks')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Rank Rewards</span>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.unclaimedRewardsCount !== undefined &&
                currentUser.unclaimedRewardsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                    {currentUser.unclaimedRewardsCount} Claim
                  </span>
                )}
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                  openMenus.ranks ? 'rotate-90' : ''
                }`}
              />
            </div>
          </button>
          {openMenus.ranks && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/ranks"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Ranks &amp; Progress</span>
              </NavLink>
              <NavLink
                to="/user/claim-rewards"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Claim Rewards &amp; History</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Section Divider: Ecosystem & Academy */}
        <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Ecosystem &amp; Academy
        </div>

        {/* 7. OpenAid Academy (Collapsible Dropdown matching sidebar.blade.php lines 382-443) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('academy')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              location.pathname.includes('/academy')
                ? 'bg-gradient-to-r from-[#ff7a1a]/25 to-[#ff7a1a]/5 text-[#ff7a1a] border-l-4 border-[#ff7a1a] font-bold shadow-xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>OpenAid Academy</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.academy ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.academy && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/academy"
                end
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Course Catalog</span>
              </NavLink>

              {/* Category 1: Beginner Course (matching Laravel .submenu-course-header) */}
              <div className="pt-2 pb-0.5 px-2 text-[10px] font-bold tracking-wider text-[#ff9f43] uppercase flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Beginner Course</span>
              </div>
              <NavLink
                to="/user/academy/course/beginner-class-no-1"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Beginner Class No. 1</span>
              </NavLink>
              <NavLink
                to="/user/academy/course/beginner-class-no-2"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Beginner Class No. 2</span>
              </NavLink>

              {/* Category 2: Intermediate Course (matching Laravel .submenu-course-header.intermediate) */}
              <div className="pt-2.5 pb-0.5 px-2 text-[10px] font-bold tracking-wider text-[#38bdf8] uppercase flex items-center gap-1.5 border-t border-dashed border-white/15 mt-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Intermediate Course</span>
              </div>
              <NavLink
                to="/user/academy/course/intermediate-class-no-1"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Intermediate Class No. 1</span>
              </NavLink>
              <NavLink
                to="/user/academy/course/intermediate-class-no-2"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Intermediate Class No. 2</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/user/openaid-token"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>OpenAid Token</span>
          </div>
          <span className="text-[9px] font-bold bg-white/10 text-amber-300 px-1.5 py-0.5 rounded">
            Soon
          </span>
        </NavLink>

        <NavLink
          to="/user/market"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Store className="w-4 h-4 text-sky-400" />
            <span>E-Market</span>
          </div>
          <span className="text-[9px] font-bold bg-white/10 text-amber-300 px-1.5 py-0.5 rounded">
            Soon
          </span>
        </NavLink>

        <NavLink
          to="/user/jobs"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Bot className="w-4 h-4 text-teal-400" />
            <span>OpenAid Bot</span>
          </div>
          <span className="text-[9px] font-bold bg-white/10 text-amber-300 px-1.5 py-0.5 rounded">
            Soon
          </span>
        </NavLink>

        <NavLink
          to="/user/news-events"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Newspaper className="w-4 h-4 text-blue-400" />
            <span>News &amp; Events</span>
          </div>
        </NavLink>

        <NavLink
          to="/user/business-material"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-orange-400" />
            <span>Business Material</span>
          </div>
        </NavLink>

        <NavLink
          to="/user/support"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Support Tickets</span>
          </div>
        </NavLink>

        <NavLink
          to="/user/announcements"
          onClick={onCloseMobile}
          className={navItemClass}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span>Announcements</span>
          </div>
        </NavLink>

        {/* Section Divider: Security & Settings */}
        <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Security &amp; Settings
        </div>

        {/* Account & Security (Dropdown) */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('account')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Account &amp; Security</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform opacity-70 ${
                openMenus.account ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openMenus.account && (
            <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-white/10 ml-5 my-1">
              <NavLink
                to="/user/profile"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• My Profile</span>
              </NavLink>
              <NavLink
                to="/user/wallet-address"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• USDT BEP-20 Wallet</span>
              </NavLink>
              <NavLink
                to="/user/change-password"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Change Password</span>
              </NavLink>
              <NavLink
                to="/user/change-transaction-password"
                onClick={onCloseMobile}
                className={submenuItemClass}
              >
                <span>• Transaction Password</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="pt-3 pb-6">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Are you sure you want to log out of OpenAid Member Portal?')) {
                await logout();
                navigate('/login');
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar Floating Rounded Card (lg:) matching Laravel design */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-[#0c2c23] rounded-[24px] border border-white/10 shadow-xl overflow-hidden sticky top-20 self-start">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer (< lg:) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0c2c23] shadow-2xl z-50 flex flex-col">
            <div className="h-14 px-4 bg-[#082019] flex items-center justify-between border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a]"></span>
                Navigation Menu
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
