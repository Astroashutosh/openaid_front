import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Wallet,
  Clock,
  Gift,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Trophy,
  Ticket,
  Layers,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Network
} from 'lucide-react';

interface FifoPackage {
  id: number;
  name: string;
  price: number;
  daily_limit_amount: number;
  donations_today: number;
  remaining_capacity: number;
  donors_received: number; // 0, 1, or 2
  target_return: number; // 162%
  is_active: boolean;
  active_count: number;
  position_id: number;
  ref_code: string;
}

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dynamic Greeting based on current hour
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return { text: 'Good morning', emoji: '🌅' };
    if (h >= 12 && h < 17) return { text: 'Good afternoon', emoji: '☀️' };
    if (h >= 17 && h < 22) return { text: 'Good evening', emoji: '🌆' };
    return { text: 'Welcome back', emoji: '🌙' };
  };

  const greeting = getGreeting();
  const userName = 'Samuel Ozor';
  const username = 'OAI798249';
  const sponsor = 'OAI684742';

  // Copy Referral Link State
  const [copiedLink, setCopiedLink] = useState(false);
  const referralUrl = `http://localhost/openaid_laravel/register/${username}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // 24-Hour Timer Countdown to Next Midnight
  const [resetTimer, setResetTimer] = useState('06h 34m 33s');
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = Math.max(0, tomorrow.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      setResetTimer(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Announcement Swipe Banner State
  const announcements = [
    {
      id: 1,
      badge: '2:1 FIFO',
      badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200',
      text: 'Sequential 2:1 Matching Protocol Active: Donations matched in FIFO order with 2 peer donors.',
      link: '/user/live-queue-tracker',
      btnText: 'Queue Tracker →',
    },
    {
      id: 2,
      badge: 'Rank Rewards',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      text: 'Executive Milestones: Advance sequential tiers to unlock luxury electronics, travel & cash rewards.',
      link: '/user/ranks',
      btnText: 'View Ranks →',
    },
    {
      id: 3,
      badge: 'Fair Limits',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      text: '24-Hour Fair Allocation: Daily limits ($200/day for Tier 1) preserve community liquidity.',
      link: '/user/make-donation',
      btnText: 'Make Donation →',
    },
    {
      id: 4,
      badge: 'Credits',
      badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
      text: 'Instant Downline Activations: Generate or transfer Credits with zero delay for fast member activation.',
      link: '/user/my-epins',
      btnText: 'Credits Hub →',
    },
  ];

  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // FIFO 3-Package System State ($100, $200, $50)
  const packages: FifoPackage[] = [
    {
      id: 1,
      name: '$100 Donation',
      price: 100,
      daily_limit_amount: 200,
      donations_today: 0,
      remaining_capacity: 200,
      donors_received: 0, // 0/2 matched
      target_return: 162,
      is_active: true,
      active_count: 2,
      position_id: 728,
      ref_code: 'MDCIMXRAMLDD',
    },
    {
      id: 2,
      name: '$200 Donation',
      price: 200,
      daily_limit_amount: 400,
      donations_today: 0,
      remaining_capacity: 400,
      donors_received: 0,
      target_return: 324,
      is_active: true,
      active_count: 2,
      position_id: 730,
      ref_code: 'MDCIMXRAMLDE',
    },
    {
      id: 3,
      name: '$50 Donation',
      price: 50,
      daily_limit_amount: 100,
      donations_today: 0,
      remaining_capacity: 100,
      donors_received: 0,
      target_return: 81,
      is_active: true,
      active_count: 2,
      position_id: 735,
      ref_code: 'MDCIMXRAMLDF',
    },
  ];

  const [activePackageId, setActivePackageId] = useState<number>(1);
  const activePkg = packages.find((p) => p.id === activePackageId) || packages[0];

  // 8-Level Commission Breakdown Table Data
  const levels = [
    { level: 1, name: 'Level 1 (Direct)', percentage: 8.0, isDirect: true },
    { level: 2, name: 'Level 2', percentage: 2.0, isDirect: false },
    { level: 3, name: 'Level 3', percentage: 2.0, isDirect: false },
    { level: 4, name: 'Level 4', percentage: 2.0, isDirect: false },
    { level: 5, name: 'Level 5', percentage: 2.0, isDirect: false },
    { level: 6, name: 'Level 6', percentage: 1.0, isDirect: false },
    { level: 7, name: 'Level 7', percentage: 1.0, isDirect: false },
    { level: 8, name: 'Level 8', percentage: 1.0, isDirect: false },
  ];

  // Recent Activity Ledger matching Screenshot 5 exactly
  const recentActivities = [
    {
      date: '09 Oct 2026, 05:58 PM',
      description: 'Instant Withdraw (USDT BEP-20) #WDXK295607 from Main Balance to 0xa2e6...b6b2',
      amount: '$56.00',
      isDebit: true,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:50 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $50 Donation',
      amount: '$4.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:48 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $50 Donation',
      amount: '$4.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:48 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $100 Donation',
      amount: '$8.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:47 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $100 Donation',
      amount: '$8.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:46 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $200 Donation',
      amount: '$16.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:45 PM',
      description: 'Direct Referral (8%) income from OAI293884 on $200 Donation',
      amount: '$16.00',
      isDebit: false,
      status: 'Completed',
    },
    {
      date: '09 Oct 2026, 05:39 PM',
      description: 'Pin Codes: JOKXZAZC, CJNVANZG transferred to OAI488676 (Raji Toyyib Abiodun)',
      amount: '$10.00',
      isDebit: true,
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 0. Top Hero Slider Banner matching Screenshot 1 */}
      <div className="rounded-[22px] overflow-hidden shadow-md relative text-white bg-gradient-to-r from-[#0c2c23] via-[#114234] to-[#0c2c23] p-6 sm:p-8">
        {/* Subtle decorative Earth Globe illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex items-center justify-end pr-8">
          <svg viewBox="0 0 200 200" className="w-64 h-64 text-emerald-300 fill-current">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M100 10 A90 90 0 0 0 100 190" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10 100 A90 90 0 0 0 190 100" fill="none" stroke="currentColor" strokeWidth="2" />
            <ellipse cx="100" cy="100" rx="45" ry="90" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <span>📢</span>
            <span className="uppercase">Sequential 2:1 FIFO Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to OpenAid Helping Community
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Give help to 2 matched community members and receive 162% back through peer-to-peer donation distribution.
          </p>

          {/* Slider Pagination Controls matching Screenshot 1 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-2 rounded-full bg-[#ff7a1a]"></span>
              <span className="w-2 h-2 rounded-full bg-white/40"></span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Rotating Announcement Swipe Banner matching Screenshot 1 */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Orange Megaphone Box */}
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff7a1a] flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>

          {/* Notice Badge */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-900 text-white shrink-0">
            Notice
          </span>

          <span className="hidden sm:inline-block h-4 w-px bg-slate-200 shrink-0"></span>

          {/* Dynamic Active Slide */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${announcements[announcementIdx].badgeClass}`}
            >
              {announcements[announcementIdx].badge}
            </span>
            <p className="text-xs text-slate-700 truncate font-medium">
              {announcements[announcementIdx].text}
            </p>
          </div>
        </div>

        {/* Right Action Button & Nav Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate(announcements[announcementIdx].link)}
            className="px-3.5 py-1.5 rounded-xl bg-[#ff7a1a] hover:bg-[#e86b10] text-white font-bold text-xs shadow-xs transition"
          >
            {announcements[announcementIdx].btnText}
          </button>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={() =>
                setAnnouncementIdx(
                  (prev) => (prev - 1 + announcements.length) % announcements.length
                )
              }
              className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {announcements.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === announcementIdx
                      ? 'w-4 h-1.5 bg-[#ff7a1a]'
                      : 'w-1.5 h-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setAnnouncementIdx((prev) => (prev + 1) % announcements.length)
              }
              className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Welcome Back & 24h Capacity Banner matching Screenshot 1 & 2 */}
      <div
        className="rounded-[22px] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0c2c23 0%, #114234 50%, #ff7a1a 100%)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-white/15 text-amber-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              OpenAid International • Helping Community
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {greeting.text}, {userName} {greeting.emoji}
            </h2>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-xl">
              Welcome back to your member dashboard. Sequential 2:1 FIFO Matching Protocol with peer-to-peer donation distribution and a sustainable level commission structure.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-lg bg-black/30 font-medium">
                ID: <strong className="text-amber-400 font-mono">{username}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/30 font-medium">
                Sponsor: <strong className="text-white">{sponsor}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#16a34a] font-extrabold text-[11px] shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Donor
              </span>
            </div>
          </div>

          {/* Right 24h Capacity Meter Card matching Screenshot 1 & 2 */}
          <div className="lg:col-span-5">
            <div className="bg-black/25 rounded-2xl p-4 sm:p-5 border border-white/20 backdrop-blur-md space-y-2.5 shadow-lg max-w-sm ml-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-white/85">
                  24-Hour Donation Allowance
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                  MAX ${activePkg.daily_limit_amount}/DAY
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                    ${activePkg.remaining_capacity.toFixed(2)}
                  </h3>
                  <span className="text-xs text-white/60 font-medium">
                    / ${activePkg.daily_limit_amount.toFixed(2)} Remaining
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${(activePkg.remaining_capacity / activePkg.daily_limit_amount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/75 pt-1.5 border-t border-white/10">
                <div>
                  <span>Used Today: </span>
                  <strong className="text-white font-mono">${activePkg.donations_today.toFixed(2)}</strong>
                  <span className="text-[10px] text-white/60 block">({activePkg.name})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60 block">Limit Resets Every 24h:</span>
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Clock className="w-3 h-3" /> {resetTimer}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sequential 2:1 FIFO Receiver Progress Tracker matching Screenshot 2 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400 block mb-0.5">
              Live Community Queue Tracker
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Sequential 2:1 FIFO Receiver Cycle
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate('/user/receive-donation')}
            className="px-3.5 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Incoming Matches →</span>
          </button>
        </div>

        {/* 3 Package Selector Tabs ($100, $200, $50 in 1 single line) matching Screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-100 p-1.5 rounded-2xl">
          {packages.map((pkg) => {
            const isSelected = pkg.id === activePackageId;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setActivePackageId(pkg.id)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[1.5px] border-[#0E2718] shadow-xs'
                    : 'bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-bold ${
                      isSelected ? 'text-[#0E2718]' : 'text-slate-700'
                    }`}
                  >
                    {pkg.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                    {pkg.active_count} Pos
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                  In FIFO Queue ({pkg.donors_received}/2)
                </span>
              </button>
            );
          })}
        </div>

        {/* Queue Position Status Row matching Screenshot 2 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-[11px] flex items-center gap-1">
              <span>⌛</span> Waiting in Queue
            </span>
            <span className="font-bold text-slate-800">
              Position #{activePkg.position_id}{' '}
              <span className="text-slate-400 font-normal">({activePkg.ref_code})</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Active Positions:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">
              #{activePkg.position_id} ({activePkg.donors_received}/2)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold text-[10px]">
              #{activePkg.position_id + 1} ({activePkg.donors_received}/2)
            </span>
          </div>
        </div>

        {/* 3-Step Milestone Visualizer matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                1. Donation Request
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
              Donation of ${activePkg.price.toFixed(2)} submitted into the ${activePkg.price} FIFO queue.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                2. First Donor Matched (81%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
              Waiting in FIFO queue for 1st matched donor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                3. Second Donor (162% Total)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
              Waiting in FIFO queue for 2nd matched donor.
            </p>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-semibold">
              Round Progress: <strong>{activePkg.donors_received} of 2 Donors Matched</strong>
            </span>
            <span className="font-bold text-emerald-600">
              $0.00 / ${activePkg.target_return.toFixed(2)} (0%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(activePkg.donors_received / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. 4 Core Metric Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Help Given */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUp className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-emerald-700 border border-emerald-200">
                FIFO MD
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">
              Total Help Given
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">$700.00</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Lifetime Donations</span>
            <button
              type="button"
              onClick={() => navigate('/user/make-donation')}
              className="text-emerald-600 font-bold hover:underline"
            >
              Donate →
            </button>
          </div>
        </div>

        {/* Card 2: Total Help Received */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ArrowDown className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-sky-700 border border-sky-200">
                FIFO RD
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">
              Total Help Received
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">$0.00</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">162% Payouts</span>
            <button
              type="button"
              onClick={() => navigate('/user/receive-donation')}
              className="text-sky-600 font-bold hover:underline"
            >
              Matches →
            </button>
          </div>
        </div>

        {/* Card 3: Available Credits */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                $10 / Credit
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">
              Available Credits
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              0 <span className="text-xs font-normal text-slate-400">Credits</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => navigate('/user/buy-epins')}
              className="text-amber-600 font-bold hover:underline"
            >
              Buy Credit
            </button>
            <button
              type="button"
              onClick={() => navigate('/user/transfer-epin')}
              className="text-slate-400 hover:text-slate-600"
            >
              Transfer →
            </button>
          </div>
        </div>

        {/* Card 4: Commission Wallet */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                8 Levels
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">
              Commission Wallet
            </span>
            <div className="text-2xl font-black text-purple-700 mt-0.5">$0.00</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Earned: $56.00</span>
            <button
              type="button"
              onClick={() => navigate('/user/withdraw-usdt')}
              className="text-purple-600 font-bold hover:underline"
            >
              Withdraw →
            </button>
          </div>
        </div>
      </div>

      {/* 5. 4 Quick Actions Grid matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: Make Donation */}
        <div
          onClick={() => navigate('/user/make-donation')}
          className="rounded-2xl p-4 bg-[#effbf6] border-l-4 border-[#10b981] shadow-xs cursor-pointer hover:shadow-md transition flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Make Donation (MD)</h4>
            <p className="text-[11px] text-slate-500">Send $100 / $200 into queue</p>
          </div>
        </div>

        {/* Action 2: Receive Donation */}
        <div
          onClick={() => navigate('/user/receive-donation')}
          className="rounded-2xl p-4 bg-[#f0f9ff] border-l-4 border-[#0284c7] shadow-xs cursor-pointer hover:shadow-md transition flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Receive Donation (RD)</h4>
            <p className="text-[11px] text-slate-500">Confirm incoming payments</p>
          </div>
        </div>

        {/* Action 3: Credits Center */}
        <div
          onClick={() => navigate('/user/my-epins')}
          className="rounded-2xl p-4 bg-[#fffbeb] border-l-4 border-[#f59e0b] shadow-xs cursor-pointer hover:shadow-md transition flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Credits Center</h4>
            <p className="text-[11px] text-slate-500">Buy or transfer active Credits</p>
          </div>
        </div>

        {/* Action 4: Level Team Tree */}
        <div
          onClick={() => navigate('/user/genealogy-view')}
          className="rounded-2xl p-4 bg-[#fdf4ff] border-l-4 border-[#c026d3] shadow-xs cursor-pointer hover:shadow-md transition flex items-center gap-3.5"
        >
          <div className="w-11 h-11 rounded-full bg-[#c026d3] text-white flex items-center justify-center shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Level Team Tree</h4>
            <p className="text-[11px] text-slate-500">View downline & volume</p>
          </div>
        </div>
      </div>

      {/* 6. Unique Referral Link Box matching Screenshot 3 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl text-amber-500">🔗</span>
              <h4 className="text-base font-bold text-slate-900">Your Unique Referral Link</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Share your referral link to build your level team and earn direct commissions on every donation round.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs font-mono px-3.5 py-2.5 rounded-l-xl outline-none truncate text-slate-700"
              />
              <button
                type="button"
                onClick={copyReferral}
                className="px-4 py-2.5 bg-[#0E2718] hover:bg-slate-900 text-white font-bold text-xs rounded-r-xl transition flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Total Direct Partners: <strong className="text-slate-900">1</strong></span>
              <span>Active Donors: <strong className="text-emerald-600">1</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Side-by-Side: 8-Level Commission Matrix & Rank Advancement matching Screenshot 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8-Level Commission Matrix */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Level Referral Engine
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                Direct Payout
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-2.5">Level</th>
                    <th className="py-2.5">Commission %</th>
                    <th className="py-2.5 text-right">On $100 Donation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {levels.map((lvl) => (
                    <tr key={lvl.level}>
                      <td className="py-2">
                        {lvl.isDirect ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            {lvl.name}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {lvl.name}
                          </span>
                        )}
                      </td>
                      <td className="py-2 font-bold text-emerald-600">{lvl.percentage.toFixed(2)}%</td>
                      <td className="py-2 text-right font-bold text-slate-900">${(lvl.percentage).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Total MLM Distributed: <strong className="text-slate-800">19.00%</strong></span>
            <span>Company Wallet Reserve: <strong className="text-slate-800">1.00%</strong></span>
          </div>
        </div>

        {/* Rank Advancement & Rewards matching Screenshot 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Rank & Leadership Rewards
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Leadership Pool
              </span>
            </div>

            {/* Dark Green Status Box matching Screenshot 4 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c2c23] to-[#164e40] text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                  Current Rank
                </span>
                <div className="text-lg font-black text-amber-400 mt-0.5">⭐ NO RANK</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                  Referral & Level Earning
                </span>
                <div className="text-xl font-black text-white mt-0.5">$56.00</div>
              </div>
            </div>

            {/* Target Next Rank Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">
                  Target Next Rank: <strong>Starter</strong>
                </span>
                <span className="font-bold text-slate-800">
                  $56.00 / $1,500 (3.7%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '3.7%' }} />
              </div>
            </div>

            {/* Reward Box with 4 Gift Options matching Screenshot 4 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Next Rank Reward
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Select 1 of 4 Gift Options
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  +$100.00 Cash Bonus
                </span>
              </div>

              {/* 4 Gift Pills matching Screenshot 4 */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/80">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                  <span>🎁</span> Electric blender
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                  <span>🎁</span> Electric kettle
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                  <span>🎁</span> Rice cooker
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                  <span>🎁</span> Standing fan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Recent Activity Ledger Table matching Screenshot 5 exactly */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Activity Ledger</h3>
            <p className="text-xs text-slate-400">Tracking your recent donations, matches, and commission credits</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/user/transactions')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0c2c23] hover:bg-slate-900 text-white font-bold text-xs transition"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivities.map((act, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-500 whitespace-nowrap">
                    {act.date}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 max-w-md">
                    {act.description}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-extrabold whitespace-nowrap ${
                      act.isDebit ? 'text-slate-900' : 'text-emerald-600'
                    }`}
                  >
                    {act.amount}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
