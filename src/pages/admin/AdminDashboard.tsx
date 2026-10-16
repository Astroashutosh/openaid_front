import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  Heart,
  AlertTriangle,
  Trophy,
  ArrowRight,
  DollarSign,
  Layers,
  RefreshCw,
  Hourglass,
  Ticket,
  Download,
  Search,
  Gift,
  Building2,
  PieChart,
  Zap,
  Shield,
  Package,
  Network,
} from 'lucide-react';
import {
  adminDashboardService,
  type DashboardOverviewData,
} from '../../services/adminDashboardService';
import { exportTableToExcel } from '../../utils/exportUtils';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedQueueId, setSelectedQueueId] = useState<number | 'all'>('all');

  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await adminDashboardService.getDashboardOverview();
      setData(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load executive dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Currency & Number Formatting Utilities
  const formatCurrency = (val: number | undefined | null) => {
    const num = Number(val) || 0;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (val: number | undefined | null) => {
    const num = Number(val) || 0;
    return num.toLocaleString('en-US');
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filter transactions locally by search term
  const filteredTransactions = (data?.transactions || []).filter((tx) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      tx.username?.toLowerCase().includes(term) ||
      tx.full_name?.toLowerCase().includes(term) ||
      tx.trans_id?.toLowerCase().includes(term) ||
      tx.type?.toLowerCase().includes(term) ||
      tx.description?.toLowerCase().includes(term)
    );
  });

  const handleExportTransactions = () => {
    if (!data?.transactions || data.transactions.length === 0) return;
    const headers = ['Trans ID', 'User ID', 'Username', 'Member Name', 'Description', 'Amount', 'Date'];
    const rows = filteredTransactions.map((tx) => [
      tx.trans_id || `#${tx.id}`,
      tx.user_id,
      tx.username,
      tx.full_name,
      tx.description || tx.remarks || '—',
      tx.amount,
      tx.created_at,
    ]);
    exportTableToExcel(headers, rows, 'dashboard_transactions');
  };

  // ---------------------------------------------------------------------------
  // SKELETON LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading && !data) {
    return (
      <div className="space-y-8 w-full pb-14 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-64 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#ff7a1a] border-t-transparent animate-spin mx-auto" />
            <p className="text-white/80 font-bold text-sm tracking-wide">
              Loading Executive Protocol Monitor...
            </p>
          </div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white border border-slate-200 p-5 shadow-xs" />
          ))}
        </div>

        {/* Big Block Skeleton */}
        <div className="h-72 rounded-2xl bg-white border border-slate-200 p-6 shadow-xs" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ERROR STATE WITH RETRY
  // ---------------------------------------------------------------------------
  if (errorMessage && !data) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4 my-8 max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-rose-950">Dashboard Connection Issue</h2>
        <p className="text-sm text-rose-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => loadDashboardData()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-5 sm:space-y-6 w-full pb-12 text-slate-800">
      {/* ============================================================ */}
      {/* EXECUTIVE HERO HEADER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-[#0c2c23] via-[#114234] to-[#e86710] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 text-[10px] font-bold uppercase tracking-wider text-[#ffd166] border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffa800] animate-ping" />
              OpenAid International • Helping Community
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Executive Overview &amp; Protocol Monitor
            </h1>
            <p className="text-white/85 text-xs leading-relaxed font-normal">
              Real-time monitoring of the 2:1 Sequential FIFO Queue, {d.package_stats?.length || 4} Donation Tiers, USDT Donate Vault, AC Credits, and 7-Level MLM Commissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
            {/* Real-time Status Card */}
            <div className="bg-black/40 border border-white/20 rounded-xl p-3 shrink-0 text-left lg:text-right backdrop-blur-md shadow-sm min-w-[190px]">
              <div className="text-[10px] uppercase tracking-wider text-white/80 font-bold">
                FIFO Matching Engine
              </div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5 lg:justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational • 2:1 Ratio
              </div>
              <div className="text-[10px] text-white/70 mt-0.5 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-[10px] font-bold text-white transition backdrop-blur-xs border border-white/10 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Live Reload'}</span>
            </button>
          </div>
        </div>

        {/* Action Required Alert Chips matching Laravel */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            Protocol Status:
          </span>

          {d.pending_deposits_count > 0 && (
            <NavLink
              to="/admin/deposits/pending"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffa800] text-slate-950 font-bold text-[11px] hover:brightness-110 active:scale-95 transition shadow-2xs cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-slate-950" />
              {d.pending_deposits_count} Pending Deposit(s) to Review
            </NavLink>
          )}

          {d.requested_claims_count > 0 && (
            <NavLink
              to="/admin/rank-rewards"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffd166] text-slate-950 font-bold text-[11px] hover:brightness-110 active:scale-95 transition shadow-2xs cursor-pointer"
            >
              <Trophy className="w-3 h-3 text-slate-950" />
              {d.requested_claims_count} Rank Reward Claim(s) Waiting Approval
            </NavLink>
          )}

          {d.pending_deposits_count === 0 && d.requested_claims_count === 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              All Queues Normal • 0 Pending Approvals
            </span>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: FIFO MATCHING QUEUE & CYCLE PROTOCOL */}
      {/* ============================================================ */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              FIFO Matching Queue &amp; Cycle Protocol
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Multi-Tier FIFO Engine
            </span>
          </div>
          <NavLink
            to="/admin/purchase-donation/donations"
            className="text-[11px] font-semibold text-[#172b4c] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View Live Matching Table <ArrowRight className="w-3 h-3" />
          </NavLink>
        </div>

        {/* Queue Selector Tabs: All + Tier 1 ($50), Tier 2 ($100), Tier 3 ($200), Tier 4 ($500) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 mb-3.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedQueueId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              selectedQueueId === 'all'
                ? 'bg-[#172b4c] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>All Queues Summary</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedQueueId === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700 font-semibold'
              }`}
            >
              {formatNumber(d.active_queue_count)} waiting
            </span>
          </button>

          {(d.queue_by_package || []).map((q) => {
            const isSelected = selectedQueueId === q.package_id;
            return (
              <button
                key={q.package_id}
                type="button"
                onClick={() => setSelectedQueueId(q.package_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#172b4c] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>${q.price} Queue (Tier {q.tier})</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : q.active_count > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {q.active_count} waiting
                </span>
              </button>
            );
          })}
        </div>

        {/* DYNAMIC METRIC CARDS: Switches between Global Summary or Focused Queue */}
        {(() => {
          const activeQueue =
            selectedQueueId === 'all'
              ? null
              : (d.queue_by_package || []).find((q) => q.package_id === selectedQueueId);

          if (activeQueue) {
            // FOCUSED VIEW FOR A SPECIFIC TIER QUEUE
            const recipient = activeQueue.current_recipient;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* Card 1: Current Head Recipient for this specific Tier */}
                <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-rose-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                        Current Recipient (Tier {activeQueue.tier} Head)
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>

                    {recipient ? (
                      <>
                        <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                          {recipient.username}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                          {recipient.full_name} • Log #{recipient.id}
                        </div>
                        <div className="flex items-center justify-between mt-2 mb-1 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                            ${activeQueue.price} Tier {activeQueue.tier}
                          </span>
                          <span className="font-bold text-slate-700">
                            {recipient.donors_received_count}/2 Matched
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (recipient.donors_received_count / 2) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="py-2.5 text-center">
                        <div className="text-slate-400 font-bold text-[11px]">No Active Recipient</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ${activeQueue.price} Queue is currently idle
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2.5 flex items-center justify-between font-medium">
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <span>●</span> Next for {formatCurrency(activeQueue.price * 2)} return
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedQueueId('all')}
                      className="text-slate-400 hover:text-slate-700 underline text-[10px]"
                    >
                      Show All
                    </button>
                  </div>
                </div>

                {/* Card 2: In Selected Queue (Waiting) */}
                <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-amber-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                        In ${activeQueue.price} Queue (Waiting)
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {formatNumber(activeQueue.active_count)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Donations</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-amber-600 mt-0.5">
                      {formatCurrency(activeQueue.active_amount)}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                    Awaiting matching in Tier {activeQueue.tier} FIFO line
                  </div>
                </div>

                {/* Card 3: Completed Cycles for Selected Queue */}
                <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-emerald-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                        Completed Cycles (Tier {activeQueue.tier})
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        {formatNumber(activeQueue.completed_count)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Cycles</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5">
                      {formatCurrency(activeQueue.completed_amount)}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                    Paid out 200% return ({formatCurrency(activeQueue.price * 2)} each)
                  </div>
                </div>

                {/* Card 4: Total Donations for Selected Queue */}
                <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-blue-600 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                        ${activeQueue.price} Tier Volume (MD)
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Heart className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      {formatCurrency(activeQueue.donations_volume)}
                    </div>
                    <div className="text-[11px] font-semibold text-blue-600 mt-0.5">
                      {formatNumber(activeQueue.donations_count)} Total Donations
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                    Daily Quota Limit: <strong className="text-slate-800 font-bold">Max {activeQueue.daily_limit} / day</strong>
                  </div>
                </div>
              </div>
            );
          }

          // ALL QUEUES OVERVIEW (Default)
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Card 1: Oldest Recipient in System */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-rose-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                      Oldest Recipient (Global Head)
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>

                  {d.current_recipient ? (
                    <>
                      <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                        {d.current_recipient.username}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                        {d.current_recipient.full_name} • Log #{d.current_recipient.id}
                      </div>
                      <div className="flex items-center justify-between mt-2 mb-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                          {d.current_recipient.package_title}
                        </span>
                        <span className="font-bold text-slate-700">
                          {d.current_recipient.donors_received_count}/2 Matched
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (d.current_recipient.donors_received_count / 2) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-2.5 text-center">
                      <div className="text-slate-400 font-bold text-[11px]">No Active Recipient</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Queue is currently idle</div>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-2.5 flex items-center gap-1 font-medium">
                  <span className="text-rose-600 font-bold">●</span> Next in queue for 200% return
                </div>
              </div>

              {/* Card 2: In Queue (Waiting) across all tiers */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-amber-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                      In Queue (Waiting) • All
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      {formatNumber(d.active_queue_count)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Donations</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-amber-600 mt-0.5">
                    {formatCurrency(d.active_queue_amount)}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                  Awaiting matching donors across 4 FIFO tiers
                </div>
              </div>

              {/* Card 3: Completed Cycles */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-emerald-500 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      Completed Cycles • All
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      {formatNumber(d.completed_cycles_count)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cycles</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5">
                    {formatCurrency(d.completed_cycles_amount)}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                  Received from 2 matching donors (200%)
                </div>
              </div>

              {/* Card 4: Total Help Given (MD) */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 border-l-blue-600 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      Total Help Given (MD)
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    {formatCurrency(d.total_help_given)}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-600 mt-0.5">
                    {formatNumber(d.total_donations)} Total Donations
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2.5 font-medium">
                  Today: <strong className="text-slate-800 font-bold">{formatCurrency(d.today_help_given)}</strong>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* MULTI-TIER LIVE HEAD RECEIVER GRID: Shows current receiver in each queue */}
        {/* ========================================================================= */}
        <div className="mt-4 pt-3.5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                Current Receiver in Each Queue (Independent FIFO Heads)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              4 Concurrent Matching Lines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(d.queue_by_package || []).map((q, idx) => {
              const borderColors = [
                'border-l-amber-500',
                'border-l-purple-500',
                'border-l-teal-500',
                'border-l-blue-600',
              ];
              const tagColors = [
                'bg-amber-500 text-white',
                'bg-purple-600 text-white',
                'bg-teal-600 text-white',
                'bg-blue-600 text-white',
              ];
              const bColor = borderColors[idx % borderColors.length];
              const tColor = tagColors[idx % tagColors.length];
              const recipient = q.current_recipient;
              const isSelected = selectedQueueId === q.package_id;

              return (
                <div
                  key={q.package_id}
                  className={`bg-white rounded-xl p-3 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between border-l-4 ${bColor} ${
                    isSelected ? 'ring-2 ring-[#172b4c]' : ''
                  }`}
                >
                  <div>
                    {/* Top Tier Badge & Waiting Count */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tColor}`}>
                        ${q.price} Queue (Tier {q.tier})
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {q.active_count} in line
                      </span>
                    </div>

                    {/* Current Receiver Profile */}
                    {recipient ? (
                      <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-rose-600 uppercase">
                            Next to Receive 2x:
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Log #{recipient.id}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
                          {recipient.username}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {recipient.full_name}
                        </div>

                        {/* Match Progress */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span className="text-slate-600">Matched Donors:</span>
                            <span className={recipient.donors_received_count > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                              {recipient.donors_received_count} of 2 ({recipient.donors_received_count === 1 ? '50%' : recipient.donors_received_count === 2 ? '100%' : '0%'})
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, (recipient.donors_received_count / 2) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Payout Target:</span>
                          <span className="font-bold text-emerald-700">{formatCurrency(q.price * 2)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50/60 rounded-lg p-3 text-center border border-dashed border-slate-200 my-2">
                        <div className="text-[11px] font-bold text-slate-400">No Active Recipient</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Queue is currently idle</div>
                      </div>
                    )}

                    {/* Queue Stats summary */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-50 p-1.5 rounded mb-2">
                      <div>
                        <span className="text-slate-400 block">Waiting Vol:</span>
                        <span className="font-bold text-amber-700">{formatCurrency(q.active_amount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Completed:</span>
                        <span className="font-bold text-emerald-700">{q.completed_count} cycles</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus Queue Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSelectedQueueId(q.package_id)}
                      className="font-bold text-[#172b4c] hover:underline"
                    >
                      {isSelected ? '✓ Viewing This Tier' : `Focus $${q.price} Queue`}
                    </button>
                    <NavLink
                      to="/admin/purchase-donation/donations"
                      className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                    >
                      <span>Table</span> <ArrowRight className="w-2.5 h-2.5" />
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DYNAMIC COMMUNITY PACKAGE TIERS */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Donation Package Tiers
          </h2>
          <NavLink
            to="/admin/packages/donations"
            className="text-[11px] font-semibold text-[#172b4c] hover:underline flex items-center gap-1"
          >
            Configure Packages <ArrowRight className="w-3 h-3" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {d.package_stats && d.package_stats.length > 0 ? (
            d.package_stats.map((pkg, idx) => {
              const borderColors = [
                'border-l-amber-500',
                'border-l-purple-500',
                'border-l-teal-500',
                'border-l-blue-600',
              ];
              const tagBg = [
                'bg-amber-500',
                'bg-purple-600',
                'bg-teal-600',
                'bg-blue-600',
              ];
              const bColor = borderColors[idx % borderColors.length];
              const tBg = tagBg[idx % tagBg.length];

              const totalVol = d.total_help_given || 1;
              const volPct = Math.min(100, (pkg.donations_volume / totalVol) * 100);

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:shadow-sm transition border-l-4 ${bColor} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded ${tBg} text-white font-bold text-[10px] uppercase tracking-wide`}>
                        ${parseInt(pkg.price.toString())} • TIER {pkg.tier || (idx + 1)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        Max {pkg.daily_limit}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{pkg.title}</h3>

                    <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-lg my-3">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Donations</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                          {formatNumber(pkg.donations_count)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Total Volume</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                          {formatCurrency(pkg.donations_volume)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-700 mb-1 font-medium">
                      <span>Queue: <strong className="text-amber-600 font-bold">{pkg.active_count} Waiting</strong></span>
                      <span>Cycles: <strong className="text-emerald-600 font-bold">{pkg.completed_count}</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-1.5 rounded-full ${tBg}`}
                        style={{ width: `${volPct}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] text-slate-500 font-bold">
                      {volPct.toFixed(1)}% of Volume
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-6 text-center text-slate-500 font-medium text-xs bg-white rounded-xl border border-slate-200">
              No packages configured yet.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CREDITS SYSTEM INVENTORY & MASTER VAULT */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Left: Credit System Inventory */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-purple-600" />
              Credits System Inventory
            </h3>
            <NavLink to="/admin/credits/generated" className="text-[11px] font-semibold text-purple-700 hover:underline">
              Manage Credits &rarr;
            </NavLink>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Issued</span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{formatNumber(d.total_pins)}</div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">{formatCurrency(d.total_pin_value)}</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Available</span>
              <div className="text-lg sm:text-xl font-bold text-emerald-700 mt-0.5">{formatNumber(d.available_pins_count)}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{formatCurrency(d.available_pins_value)}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-600 uppercase">Redeemed</span>
              <div className="text-lg sm:text-xl font-bold text-slate-700 mt-0.5">{formatNumber(d.used_pins_count)}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">{formatCurrency(d.used_pins_value)}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs font-medium text-purple-900">
            <span>Direct Credit Purchases Volume:</span>
            <span className="font-bold text-xs sm:text-sm text-purple-800">{formatCurrency(d.epin_purchase_amount)}</span>
          </div>
        </div>

        {/* Right: Donate Master Vault (USDT Deposits) */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Donate Master Vault (USDT)
            </h3>
            <NavLink to="/admin/deposits/all" className="text-[11px] font-semibold text-emerald-700 hover:underline">
              View All Deposits &rarr;
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-center mb-4">
            <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-100 text-left">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                Total Approved Deposits
              </span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">
                {formatCurrency(d.total_approved_deposits)}
              </div>
              <div className="text-[11px] font-medium text-emerald-600 mt-0.5">
                {formatNumber(d.approved_deposits_count)} Approved Transactions
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-100 text-left">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                Pending Verification
              </span>
              <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5">
                {formatCurrency(d.pending_deposits_amount)}
              </div>
              <div className="text-[11px] font-medium text-amber-700 mt-0.5">
                {formatNumber(d.pending_deposits_count)} Awaiting Review
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Supported Gateways:</span>
            <span className="font-bold text-slate-900">USDT BEP-20</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: WITHDRAWALS OVERVIEW (SPLIT BY WALLET) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-teal-600" />
              Withdrawals Overview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Separated between Main Commission Wallet and FIFO Donation Wallet.
            </p>
          </div>
          <NavLink to="/admin/withdrawals/history" className="text-[11px] font-semibold text-teal-700 hover:underline">
            Withdrawal Log &rarr;
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Total Paid */}
          <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-100">
            <span className="text-[10px] font-bold text-teal-800 uppercase">Total Paid Withdrawals</span>
            <div className="text-lg sm:text-xl font-bold text-teal-800 mt-0.5">
              {formatCurrency(d.withdraw_amount)}
            </div>
            <span className="text-[11px] text-teal-600 font-medium mt-0.5 block">
              {formatNumber(d.paid_withdrawals_count)} Completed Payouts
            </span>
          </div>

          {/* Pending Withdrawals */}
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-100">
            <span className="text-[10px] font-bold text-rose-800 uppercase">Pending Review</span>
            <div className="text-lg sm:text-xl font-bold text-rose-700 mt-0.5">
              {formatCurrency(d.pending_withdrawals_amount)}
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-0.5 block">
              {formatNumber(d.pending_withdrawals_count)} Requests Waiting
            </span>
          </div>

          {/* Main Wallet Paid */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Main Wallet Payouts</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {formatCurrency(d.main_paid_amount)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {formatNumber(d.main_paid_count)} Payouts ({formatCurrency(d.main_pending_amount)} Pending)
            </span>
          </div>

          {/* Donation Wallet Paid */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Donation Wallet Payouts</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {formatCurrency(d.donation_paid_amount)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
              {formatNumber(d.donation_paid_count)} Payouts ({formatCurrency(d.donation_pending_amount)} Pending)
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 5: USER & COMMUNITY STATISTICS */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Member Community Growth
          </h2>
          <NavLink to="/admin/members/active" className="text-[11px] font-semibold text-[#172b4c] hover:underline">
            View All Members &rarr;
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Total Members */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-blue-600">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Registered Members</span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {formatNumber(d.total_users)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Today Registrations: <strong className="text-blue-600 font-bold">+{d.today_users}</strong>
            </div>
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active Members</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
              {formatNumber(d.total_active_users)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Today Active: <strong className="text-emerald-600 font-bold">+{d.today_active_users}</strong>
            </div>
          </div>

          {/* Inactive Members */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending / Inactive Members</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {formatNumber(d.total_inactive_users)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Today Inactive: <strong className="text-amber-600 font-bold">+{d.today_inactive_users}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: 8-TIER MLM COMMISSION & 1% PROTOCOL FEE (MATCHING LARAVEL 100%) */}
      {/* ============================================================ */}
      <div className="space-y-4 sm:space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-600" />
            8-Tier MLM Commission &amp; 1% Protocol Fee (19% Protocol Allocation)
          </h2>
          <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
            L1 (8%) + L2-L7 (10%) + L8 Protocol (1%) = 19%
          </span>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Direct Sponsor Bonus (L1) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-purple-500 flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  Direct Sponsor Bonus (L1)
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(d.direct_commission)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                <strong className="text-slate-700">8.00%</strong> direct sponsor bonus on package donations
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <NavLink 
                to="/admin/reports/referral"
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
              >
                View Referral Report &rarr;
              </NavLink>
            </div>
          </div>

          {/* Card 2: Level Commission (L2-L7) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-amber-500 flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Level Commission (L2-L7)
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Network className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(d.level_commission)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                <strong className="text-slate-700">10.00%</strong> team bonus across 6 generational levels
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <NavLink
                to="/admin/reports/level"
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
                View Level Report &rarr;
              </NavLink>
            </div>
          </div>

          {/* Card 3: 1% Protocol Fee (8th Level) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-teal-500 flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                  1% Protocol Fee (8th Level)
                </span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(d.protocol_fee_amount)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                <strong className="text-slate-700">1.00%</strong> platform protocol fee ({formatNumber(d.protocol_fee_count)} collections)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">

             

               <NavLink
                to="/admin/reports/level"
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
              >
              View Protocol Transactions &rarr;
              </NavLink>
            
            </div>
          </div>

          {/* Card 4: Total Distributed (19%) */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs border-l-4 border-l-emerald-500 flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Total Distributed (19%)
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {formatCurrency(d.total_commissions_and_fees)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Cumulative 19% protocol allocation on community volume
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                Fully Balanced
              </span>
            </div>
          </div>
        </div>

        {/* Operational Status (Rank Rewards + Admin Quick Actions Hub) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Left: Rank Rewards Milestone System (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Rank Rewards Milestone System
              </h3>
              {d.requested_claims_count > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
                  {d.requested_claims_count} Actionable Request(s)
                </span>
              )}
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Tracking 1-by-1 sequential rank advancements, member reward claims, and admin approval lifecycle.
                </p>

                <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl mb-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block truncate">Claim Requests</span>
                    <div className={`text-base sm:text-lg font-bold mt-0.5 ${d.requested_claims_count > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {formatNumber(d.requested_claims_count)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block truncate">Unclaimed</span>
                    <div className="text-base sm:text-lg font-bold text-cyan-600 mt-0.5">
                      {formatNumber(d.unclaimed_rewards_count)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block truncate">Approved</span>
                    <div className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
                      {formatNumber(d.approved_rewards_count)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block truncate">Total Achieved</span>
                    <div className="text-base sm:text-lg font-bold text-purple-600 mt-0.5">
                      {formatNumber(d.total_rewards_awarded)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <div className="text-xs text-slate-600 font-medium">
                  Total Cash Bonuses Approved: <strong className="text-emerald-600 font-bold">{formatCurrency(d.total_approved_bonus)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/admin/rank-rewards/pending"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#172b4c] text-white hover:bg-[#1f3860] shadow-xs transition inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Review Pending Claims ({d.requested_claims_count})
                  </NavLink>
                  <NavLink
                    to="/admin/rank-rewards/approved"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
                  >
                    Approved Log
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Admin Quick Actions Hub (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Admin Quick Actions Hub
              </h3>
            </div>

            <div className="p-3 flex-1">
              <div className="grid grid-cols-2 gap-2 h-full">
                <NavLink
                  to="/admin/credits/transferred"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <Ticket className="w-3.5 h-3.5 text-purple-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Generate Credits</span>
                </NavLink>

                <NavLink
                  to="/admin/packages/donations"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <Package className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Donation Tiers</span>
                </NavLink>

                <NavLink
                  to="/admin/deposits/all"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Verify Donate</span>
                </NavLink>

                <NavLink
                  to="/admin/rank-rewards/pending"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <Trophy className="w-3.5 h-3.5 text-purple-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Rank Requests</span>
                </NavLink>

                <NavLink
                  to="/admin/withdrawals/history"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Withdraw History</span>
                </NavLink>

                <NavLink
                  to="/admin/members/active"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#172b4c]/30 text-slate-800 text-xs font-semibold transition shadow-2xs group"
                >
                  <Users className="w-3.5 h-3.5 text-orange-600 shrink-0 group-hover:scale-110 transition" />
                  <span className="truncate">Active Members</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 7: RECENT TRANSACTIONS ACTIVITY FEED (LATEST 50) */}
      {/* ============================================================ */}
      <div id="recent-activity-feed" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Activity</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#172b4c]/10 text-[#172b4c]">
                Latest 50
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Showing the latest 50 matching, withdrawals, deposits, and commission transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search latest 50..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#172b4c] outline-hidden transition"
              />
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExportTransactions}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3 h-3 text-slate-500" />
              Export
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Trans ID</th>
                <th className="px-4 py-2.5">Member</th>
                <th className="px-4 py-2.5">Description</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-900 text-xs">
                      {tx.trans_id || `#${tx.id}`}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-slate-900">{tx.username}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{tx.full_name}</div>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs truncate text-slate-600 text-xs">
                      {tx.description || tx.remarks || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900 text-xs sm:text-sm">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {formatDate(tx.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium text-xs">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{filteredTransactions.length}</strong> of{' '}
            <strong className="text-slate-900">{d.transactions?.length || 0}</strong> latest records
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
