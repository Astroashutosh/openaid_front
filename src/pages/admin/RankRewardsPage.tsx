import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  X,
  Check,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gift,
  ExternalLink,
  Info,
  RefreshCw,
  Send,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import {
  adminRankRewardService,
  type RankRewardItem,
  type RankRewardCounts,
} from '../../services/adminRankRewardService';

type TabType = 'pending' | 'unclaimed' | 'approved' | 'rejected';

export const RankRewardsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect active tab from URL path
  const getTabFromPath = useCallback((): TabType => {
    if (location.pathname.includes('/unclaimed')) return 'unclaimed';
    if (location.pathname.includes('/approved')) return 'approved';
    if (location.pathname.includes('/rejected')) return 'rejected';
    return 'pending'; // Default to claim requests
  }, [location.pathname]);

  const activeTab = getTabFromPath();

  // Server data state
  const [rewards, setRewards] = useState<RankRewardItem[]>([]);
  const [counts, setCounts] = useState<RankRewardCounts>({
    requested_count: 0,
    unclaimed_count: 0,
    approved_count: 0,
    rejected_count: 0,
    total_cash_given: 0,
  });

  // Filter toolbar state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Loading and feedback states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Approve / Assign modal state
  const [approvingItem, setApprovingItem] = useState<RankRewardItem | null>(null);
  const [approveSelectedOption, setApproveSelectedOption] = useState<string>('');
  const [approveRewardName, setApproveRewardName] = useState<string>('');
  const [approveAdminNotes, setApproveAdminNotes] = useState<string>('');
  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);

  // Reject modal state
  const [rejectingItem, setRejectingItem] = useState<RankRewardItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Clear toast after timeout
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Load data from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminRankRewardService.getRankRewards({
        tab: activeTab,
        search: searchTerm,
        page,
        limit: pageSize,
      });

      if (res.success) {
        setRewards(res.data);
        setCounts(res.counts);
        setTotalPages(res.pagination.totalPages);
        setTotalRecords(res.pagination.total);
      } else {
        setError('Failed to retrieve rank rewards data');
      }
    } catch (err: any) {
      console.error('Fetch rank rewards error:', err);
      setError(err?.response?.data?.message || err?.message || 'Error loading rank rewards');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Tab Switch
  const handleTabChange = (tab: TabType) => {
    setPage(1);
    setSearchTerm('');
    setSearchInput('');
    navigate(`/admin/rank-rewards/${tab}`);
  };

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  // Open Approve / Assign modal
  const handleOpenApproveModal = (item: RankRewardItem) => {
    setApprovingItem(item);
    // Pre-select reward item
    const defaultName = item.rewardName || (item.rewardOptions && item.rewardOptions[0]) || '';
    setApproveRewardName(defaultName);
    setApproveSelectedOption(defaultName);
    setApproveAdminNotes('');
  };

  // Handle option dropdown select in approve modal
  const handleOptionDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setApproveSelectedOption(val);
    if (val) {
      setApproveRewardName(val);
    }
  };

  // Submit Approve
  const handleConfirmApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingItem) return;
    if (!approveRewardName.trim()) {
      alert('Please enter or select a reward item name.');
      return;
    }

    setIsSubmittingApprove(true);
    try {
      const res = await adminRankRewardService.approveReward(approvingItem.id, {
        reward_name: approveRewardName.trim(),
        admin_notes: approveAdminNotes.trim(),
      });

      if (res.success) {
        setSuccessToast(res.message);
        setApprovingItem(null);
        fetchData();
      } else {
        alert(res.message || 'Failed to approve rank reward');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Error approving rank reward');
    } finally {
      setIsSubmittingApprove(false);
    }
  };

  // Open Reject modal
  const handleOpenRejectModal = (item: RankRewardItem) => {
    setRejectingItem(item);
    setRejectReason('');
  };

  // Submit Reject
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting this claim.');
      return;
    }

    setIsSubmittingReject(true);
    try {
      const res = await adminRankRewardService.rejectReward(rejectingItem.id, {
        reason: rejectReason.trim(),
      });

      if (res.success) {
        setSuccessToast(res.message);
        setRejectingItem(null);
        fetchData();
      } else {
        alert(res.message || 'Failed to reject rank reward');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Error rejecting rank reward');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  // Export handlers
  const handleExportExcel = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeTab === 'pending') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank Achieved', 'Requested Item', 'Cash Bonus ($)', 'Claim Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.rewardName || 'Choice Needed',
        r.rewardAmount.toFixed(2),
        formatDate(r.updatedAt || r.createdAt),
        'Requested',
      ]);
    } else if (activeTab === 'unclaimed') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank Achieved', 'Available Reward Options', 'Cash Bonus ($)', 'Unlocked Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        (r.rewardOptions || []).join(' | '),
        r.rewardAmount.toFixed(2),
        formatDate(r.createdAt),
        r.lastRejection ? 'Reselection Required' : 'Unclaimed',
      ]);
    } else if (activeTab === 'approved') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank Achieved', 'Rewarded Item', 'Cash Bonus ($)', 'Approved By', 'Approved Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.rewardName || '-',
        r.rewardAmount.toFixed(2),
        r.approvedBy,
        formatDate(r.approvedAt || r.updatedAt),
        'Approved',
      ]);
    } else {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank Achieved', 'Declined Item', 'Decline Reason', 'Rejected By', 'Rejection Date', 'Lifecycle Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.declinedItem,
        r.declineReason,
        r.rejectedBy,
        formatDate(r.rejectedAt || r.updatedAt),
        r.status === 'pending' ? 'Reselection Pending' : r.status === 'requested' ? 'Re-Requested' : 'Resolved & Approved',
      ]);
    }

    exportTableToExcel(headers, rows, `Rank_Rewards_${activeTab}_${Date.now()}`);
  };

  const handleExportPDF = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    const titles = {
      pending: 'Rank Rewards - Claim Requests Awaiting Approval',
      unclaimed: 'Rank Rewards - Qualified Milestones (Unclaimed)',
      approved: 'Rank Rewards - Approved Ledger',
      rejected: 'Rank Rewards - Rejection Audit Log',
    };

    if (activeTab === 'pending') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank', 'Requested Item', 'Bonus ($)', 'Claim Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.rewardName || 'Choice Needed',
        `$${r.rewardAmount.toFixed(2)}`,
        formatDate(r.updatedAt || r.createdAt),
        'Requested',
      ]);
    } else if (activeTab === 'unclaimed') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank', 'Available Options', 'Bonus ($)', 'Unlocked Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        (r.rewardOptions || []).join(' | '),
        `$${r.rewardAmount.toFixed(2)}`,
        formatDate(r.createdAt),
        r.lastRejection ? 'Reselection Required' : 'Unclaimed',
      ]);
    } else if (activeTab === 'approved') {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank', 'Rewarded Item', 'Bonus ($)', 'Approved By', 'Approved Date', 'Status'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.rewardName || '-',
        `$${r.rewardAmount.toFixed(2)}`,
        r.approvedBy,
        formatDate(r.approvedAt || r.updatedAt),
        'Approved',
      ]);
    } else {
      headers = ['Transaction ID', 'User ID', 'Full Name', 'Rank', 'Declined Item', 'Reason', 'Rejected By', 'Rejection Date', 'Lifecycle'];
      rows = rewards.map((r) => [
        `#${r.transId}`,
        r.username,
        r.fullName,
        r.rankName,
        r.declinedItem,
        r.declineReason,
        r.rejectedBy,
        formatDate(r.rejectedAt || r.updatedAt),
        r.status === 'pending' ? 'Reselection Pending' : r.status === 'requested' ? 'Re-Requested' : 'Resolved',
      ]);
    }

    exportTableToPDF(titles[activeTab], headers, rows, `Rank_Rewards_${activeTab}_Report`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Toast notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-500 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="ml-2 hover:opacity-80 transition text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link to="/admin" className="hover:text-emerald-700 transition">
              Admin
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Rank Rewards</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#FF7A1A]" />
            Rank Rewards Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs Matching Laravel custom-nav-tabs */}
      <div className="bg-white px-4 pt-2.5 rounded-xl border border-slate-200/80 shadow-xs">
        <ul className="flex flex-wrap items-center gap-2 border-b border-slate-100">
          <li>
            <button
              type="button"
              onClick={() => handleTabChange('pending')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-lg transition border-b-2 -mb-px ${
                activeTab === 'pending'
                  ? 'border-[#0e3b2e] text-[#0e3b2e] bg-slate-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Claim Requests</span>
              {counts.requested_count > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                  {counts.requested_count}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleTabChange('unclaimed')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-lg transition border-b-2 -mb-px ${
                activeTab === 'unclaimed'
                  ? 'border-[#0e3b2e] text-[#0e3b2e] bg-slate-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Unclaimed Rewards</span>
              {counts.unclaimed_count > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900">
                  {counts.unclaimed_count}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleTabChange('approved')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-lg transition border-b-2 -mb-px ${
                activeTab === 'approved'
                  ? 'border-[#0e3b2e] text-[#0e3b2e] bg-slate-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Approved Ledger</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                {counts.approved_count}
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleTabChange('rejected')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-lg transition border-b-2 -mb-px ${
                activeTab === 'rejected'
                  ? 'border-[#0e3b2e] text-[#0e3b2e] bg-slate-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Rejection Audit Log</span>
              {counts.rejected_count > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {counts.rejected_count}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* Top 4 Stat Gradient Cards Matching Laravel Blades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Claims Waiting Action (Sky Blue) */}
        <div
          className="rounded-xl p-4 text-white shadow-xs transition hover:translate-y-[-2px]"
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-85">
                Claims Waiting Action
              </div>
              <h2 className="text-2xl font-black mt-1">{counts.requested_count}</h2>
              <p className="text-[11px] opacity-80 mt-0.5">Member submitted choice</p>
            </div>
            <div className="opacity-80">
              <Send className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card 2: Unclaimed by Members (Amber) */}
        <div
          className="rounded-xl p-4 text-white shadow-xs transition hover:translate-y-[-2px]"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-85">
                Unclaimed by Members
              </div>
              <h2 className="text-2xl font-black mt-1">{counts.unclaimed_count}</h2>
              <p className="text-[11px] opacity-80 mt-0.5">Target hit; yet to choose</p>
            </div>
            <div className="opacity-80">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card 3: Approved Rewards (Emerald) */}
        <div
          className="rounded-xl p-4 text-white shadow-xs transition hover:translate-y-[-2px]"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-85">
                Approved Rewards
              </div>
              <h2 className="text-2xl font-black mt-1">{counts.approved_count}</h2>
              <p className="text-[11px] opacity-80 mt-0.5">
                ${counts.total_cash_given.toFixed(2)} bonus given
              </p>
            </div>
            <div className="opacity-80">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card 4: Rejection History (Rose) */}
        <div
          className="rounded-xl p-4 text-white shadow-xs transition hover:translate-y-[-2px]"
          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold opacity-85">
                Rejection History
              </div>
              <h2 className="text-2xl font-black mt-1">{counts.rejected_count}</h2>
              <p className="text-[11px] opacity-80 mt-0.5">Reopened for re-claim</p>
            </div>
            <div className="opacity-80">
              <RotateCcw className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Box Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'pending' && (
                <>
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Claim Requests Awaiting Approval</span>
                </>
              )}
              {activeTab === 'unclaimed' && (
                <>
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Qualified Milestones (Unclaimed by Members)</span>
                </>
              )}
              {activeTab === 'approved' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approved Rank Rewards Ledger</span>
                </>
              )}
              {activeTab === 'rejected' && (
                <>
                  <RotateCcw className="w-4 h-4 text-rose-500" />
                  <span>Rejection Audit Log (Option A Tracking)</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'pending' &&
                'Review member choices, approve (with optional item modification) or reject (Option A audit trail).'}
              {activeTab === 'unclaimed' &&
                'These members have satisfied rank requirements. They can choose gifts on their dashboard, or admin can assign & approve directly on their behalf.'}
              {activeTab === 'approved' &&
                'Full historical ledger of all approved rank rewards, finalized items, and attached cash bonuses.'}
              {activeTab === 'rejected' &&
                'Full historical audit of all declined reward claims, decline reasons, reviewer details, and current re-claim resolution status.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
              title="Export to Excel / CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
              title="Export to Printable PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Standard Search Filter Toolbar Matching #searchform */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeTab === 'pending'
                  ? 'User ID / Trans ID / Rank / Reward'
                  : activeTab === 'unclaimed'
                  ? 'User ID / Trans ID / Rank'
                  : activeTab === 'approved'
                  ? 'User ID / Trans ID / Rank / Item'
                  : 'User ID / Trans ID / Rank / Reason'}
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter keyword..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#FF7A1A] bg-white transition"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">No. Of Rows</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#FF7A1A] bg-white transition"
              >
                <option value={15}>15 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition hover:brightness-95 flex items-center gap-1.5"
                style={{ backgroundColor: '#FF7A1A' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearchTerm('');
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="m-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800 tracking-wider uppercase text-[11px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Rank Achieved</th>

                {/* Tab specific columns */}
                {activeTab === 'pending' && (
                  <>
                    <th className="py-3 px-4">Requested Item</th>
                    <th className="py-3 px-4">Cash Bonus</th>
                    <th className="py-3 px-4">Claim Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center" style={{ width: '150px' }}>
                      Action
                    </th>
                  </>
                )}

                {activeTab === 'unclaimed' && (
                  <>
                    <th className="py-3 px-4">Available Reward Options</th>
                    <th className="py-3 px-4">Cash Bonus</th>
                    <th className="py-3 px-4">Unlocked Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center" style={{ width: '150px' }}>
                      Action
                    </th>
                  </>
                )}

                {activeTab === 'approved' && (
                  <>
                    <th className="py-3 px-4">Rewarded Item / Gift</th>
                    <th className="py-3 px-4">Cash Bonus</th>
                    <th className="py-3 px-4">Approved By</th>
                    <th className="py-3 px-4">Approved Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </>
                )}

                {activeTab === 'rejected' && (
                  <>
                    <th className="py-3 px-4">Declined Item</th>
                    <th className="py-3 px-4">Decline Reason</th>
                    <th className="py-3 px-4">Rejected By</th>
                    <th className="py-3 px-4">Rejection Date</th>
                    <th className="py-3 px-4 text-center">Lifecycle Status</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF7A1A]" />
                    <span>Loading rank reward records...</span>
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No records found</p>
                    <p className="text-[11px] mt-0.5">
                      {searchTerm
                        ? 'No rank rewards matched your search query.'
                        : `No entries in ${activeTab} at this moment.`}
                    </p>
                  </td>
                </tr>
              ) : (
                rewards.map((r) => {
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Transaction ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-sky-700 whitespace-nowrap">
                        #{r.transId}
                      </td>

                      {/* User ID (Link to profile) */}
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/profile/${r.userId}`}
                          className="font-bold text-slate-900 hover:text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          {r.username}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>

                      {/* Full Name */}
                      <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {r.fullName}
                      </td>

                      {/* Rank Achieved */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs">
                          🏆 {r.rankName}
                        </span>
                      </td>

                      {/* Pending Tab Columns */}
                      {activeTab === 'pending' && (
                        <>
                          <td className="py-3 px-4">
                            <strong className="text-slate-900 text-xs block">
                              {r.rewardName || 'Pending Choice'}
                            </strong>
                            {r.rejectionHistory && r.rejectionHistory.length > 0 && (
                              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                                <RotateCcw className="w-2.5 h-2.5" />
                                Re-claim ({r.rejectionHistory.length} prior rejection)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600 whitespace-nowrap">
                            +${r.rewardAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {formatDate(r.updatedAt || r.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                              <Send className="w-3 h-3" /> Requested
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenApproveModal(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenRejectModal(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                              >
                                <X className="w-3 h-3" /> Reject
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                      {/* Unclaimed Tab Columns */}
                      {activeTab === 'unclaimed' && (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {r.rewardOptions && r.rewardOptions.length > 0 ? (
                                r.rewardOptions.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px]"
                                  >
                                    {opt}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600 whitespace-nowrap">
                            +${r.rewardAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {formatDate(r.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {r.lastRejection ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  <RotateCcw className="w-3 h-3" /> Reselection Required
                                </span>
                                <div className="text-rose-600 text-[10.5px] mt-0.5">
                                  Declined: {r.lastRejection.declined_item}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3" /> Unclaimed
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenApproveModal(r)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition"
                            >
                              <Gift className="w-3 h-3" /> Assign & Approve
                            </button>
                          </td>
                        </>
                      )}

                      {/* Approved Tab Columns */}
                      {activeTab === 'approved' && (
                        <>
                          <td className="py-3 px-4">
                            <strong className="text-emerald-700 text-xs">
                              {r.rewardName || `${r.rankName} Leadership Gift`}
                            </strong>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600 whitespace-nowrap">
                            +${r.rewardAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                              {r.approvedBy}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {formatDate(r.approvedAt || r.updatedAt)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          </td>
                        </>
                      )}

                      {/* Rejected Tab Columns */}
                      {activeTab === 'rejected' && (
                        <>
                          <td className="py-3 px-4 font-bold text-rose-600">
                            {r.declinedItem}
                          </td>
                          <td className="py-3 px-4 text-slate-700 max-w-xs break-words">
                            {r.declineReason}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                              {r.rejectedBy}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {formatDate(r.rejectedAt || r.updatedAt)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {r.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <RotateCcw className="w-3 h-3" /> Reselection Pending
                              </span>
                            ) : r.status === 'requested' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                                <Send className="w-3 h-3" /> Re-Requested
                              </span>
                            ) : r.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Check className="w-3 h-3" /> Resolved & Approved
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px]">
                                {r.status}
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{rewards.length}</strong> of{' '}
            <strong className="text-slate-800">{totalRecords}</strong> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* APPROVE / ASSIGN MODAL (Matches Laravel adminApproveModal & adminAssignModal) */}
      {/* ========================================================================= */}
      {approvingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-emerald-600 text-white">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Finalize Reward</span>
              </h4>
              <button
                type="button"
                onClick={() => setApprovingItem(null)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmApprove}>
              <div className="p-4 space-y-3.5 text-xs">
                {/* Summary Box */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Member:</span>
                    <strong className="text-slate-900">{approvingItem.username}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Rank Achieved:</span>
                    <strong className="text-emerald-700">🏆 {approvingItem.rankName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Cash Bonus:</span>
                    <strong className="text-emerald-600 font-mono">
                      +${approvingItem.rewardAmount.toFixed(2)}
                    </strong>
                  </div>
                </div>

                {/* Available options select dropdown */}
                {approvingItem.rewardOptions && approvingItem.rewardOptions.length > 0 && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Select from Available Options (or edit below)
                    </label>
                    <select
                      value={approveSelectedOption}
                      onChange={handleOptionDropdownChange}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="">-- Choose Option to Autofill --</option>
                      {approvingItem.rewardOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reward Name Input */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reward Item / Gift <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={approveRewardName}
                    onChange={(e) => setApproveRewardName(e.target.value)}
                    placeholder="Enter reward item name..."
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 text-slate-900"
                  />
                  <small className="text-slate-400 block mt-1">
                    You can customize or modify this item before confirming.
                  </small>
                </div>

                {/* Admin notes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Admin Internal Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={approveAdminNotes}
                    onChange={(e) => setApproveAdminNotes(e.target.value)}
                    placeholder="e.g. Dispatched via courier, receipt ref #..."
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setApprovingItem(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApprove}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmittingApprove ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Confirm & Approve</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECT MODAL (OPTION A) (Matches Laravel adminRejectModal) */}
      {/* ========================================================================= */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-rose-600 text-white">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reject Claim (Option A)</span>
              </h4>
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="text-white/80 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject}>
              <div className="p-4 space-y-3 text-xs">
                {/* Summary Info */}
                <div className="bg-rose-50 rounded-lg p-3 border-l-4 border-rose-500 text-slate-800 space-y-1">
                  <div>
                    <span className="font-medium text-slate-600">Member: </span>
                    <strong className="text-slate-900">{rejectingItem.username}</strong>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Rank: </span>
                    <strong className="text-slate-900">{rejectingItem.rankName}</strong>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Requested Item: </span>
                    <strong className="text-rose-600">
                      {rejectingItem.rewardName || 'Reward Choice'}
                    </strong>
                  </div>
                </div>

                {/* Option A Explanation Banner */}
                <div className="bg-sky-50 border border-sky-200 text-sky-800 p-2.5 rounded-lg flex items-start gap-2 text-[11.5px] leading-relaxed">
                  <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Option A Active:</strong> The member will retain their earned rank
                    milestone. The reward status will reset to pending so they can choose another
                    gift on their dashboard.
                  </div>
                </div>

                {/* Rejection Reason textarea */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reason for Rejection <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Out of stock in your region, address outside delivery zone, please choose another item..."
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                  />
                  <small className="text-slate-400 block mt-1">
                    This reason will be visible to the member on their dashboard & rank report.
                  </small>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReject}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmittingReject ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
