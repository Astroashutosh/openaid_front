import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Users,
  Layers,
  Award,
  Receipt,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import adminReportService, {
  type ReferralReportItem,
  type LevelReportItem,
  type RankRewardReportItem,
  type TransactionReportItem,
  type ReportsSummary,
} from '../../services/adminReportService';

export const ReportsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from pathname
  const getTabFromPath = (): 'referral' | 'level' | 'rank' | 'all' => {
    if (location.pathname.includes('/referral')) return 'referral';
    if (location.pathname.includes('/level')) return 'level';
    if (location.pathname.includes('/rank-reward')) return 'rank';
    if (location.pathname.includes('/transactions')) return 'all';
    return 'referral';
  };

  const [activeTab, setActiveTab] = useState<'referral' | 'level' | 'rank' | 'all'>(getTabFromPath());
  const [loading, setLoading] = useState(false);

  // Summary Metrics
  const [summary, setSummary] = useState<ReportsSummary>({
    referral: { count: 0, amount: 0 },
    level: { count: 0, amount: 0 },
    rankReward: { count: 0, amount: 0 },
    transactions: { count: 0, amount: 0 },
  });

  // Table Data Lists
  const [referralData, setReferralData] = useState<ReferralReportItem[]>([]);
  const [levelData, setLevelData] = useState<LevelReportItem[]>([]);
  const [rankData, setRankData] = useState<RankRewardReportItem[]>([]);
  const [transData, setTransData] = useState<TransactionReportItem[]>([]);

  // Filter & Pagination States
  const [filteredTotalAmount, setFilteredTotalAmount] = useState<number>(0);
  const [searchUname, setSearchUname] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('25');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync tab on URL navigation
  useEffect(() => {
    const nextTab = getTabFromPath();
    setActiveTab(nextTab);
    setCurrentPage(1);
  }, [location.pathname]);

  // Fetch summary once on mount
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await adminReportService.getSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load summary stats:', err);
      }
    };
    fetchSummary();
  }, []);

  // Fetch records based on active tab
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const limit = parseInt(rowsPerPage) || 25;
      if (activeTab === 'referral') {
        const res = await adminReportService.getReferralCommission({
          uname: activeSearch,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setReferralData(res.data);
          setFilteredTotalAmount(res.total_amount || 0);
          setTotalCount(res.meta?.total || 0);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } else if (activeTab === 'level') {
        const res = await adminReportService.getLevelCommission({
          uname: activeSearch,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setLevelData(res.data);
          setFilteredTotalAmount(res.total_amount || 0);
          setTotalCount(res.meta?.total || 0);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } else if (activeTab === 'rank') {
        const res = await adminReportService.getRankReward({
          uname: activeSearch,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setRankData(res.data);
          setFilteredTotalAmount(res.total_amount || 0);
          setTotalCount(res.meta?.total || 0);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } else {
        const res = await adminReportService.getAllTransactions({
          uname: activeSearch,
          type: txTypeFilter || undefined,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setTransData(res.data);
          setFilteredTotalAmount(res.total_amount || 0);
          setTotalCount(res.meta?.total || 0);
          setTotalPages(res.meta?.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeSearch, txTypeFilter, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchUname.trim());
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchUname('');
    setActiveSearch('');
    setTxTypeFilter('');
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (activeTab === 'referral') {
      const headers = ['Trans Id', 'User Id', 'User Name', 'From User', 'Level', 'Percent', 'Amount', 'Date'];
      const rows = referralData.map((d) => [
        d.trans_id,
        d.username,
        d.fullname,
        d.from_username,
        d.level,
        d.perc,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'Referral_Commission_Report');
    } else if (activeTab === 'level') {
      const headers = ['Trans Id', 'User Id', 'User Name', 'From User', 'Level', 'Percent', 'Amount', 'Date'];
      const rows = levelData.map((d) => [
        d.trans_id,
        d.username,
        d.fullname,
        d.from_username,
        d.level,
        d.perc,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'Level_Commission_Report');
    } else if (activeTab === 'rank') {
      const headers = ['Trans Id', 'User Id', 'User Name', 'Rank', 'Reward Item', 'Amount', 'Date'];
      const rows = rankData.map((d) => [
        d.trans_id,
        d.username,
        d.fullname,
        d.rank_name,
        d.reward_name,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'Rank_Reward_Report');
    } else {
      const headers = ['Trans Id', 'User Id', 'User Name', 'Type', 'Amount', 'Charge', 'Description', 'Date'];
      const rows = transData.map((d) => [
        d.trans_id,
        d.username,
        d.fullname,
        d.transaction_type,
        `$${d.amount.toFixed(2)}`,
        `$${d.charge.toFixed(2)}`,
        d.description,
        new Date(d.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'All_Transactions_Report');
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (activeTab === 'referral') {
      const headers = ['Trans Id', 'User', 'From User', 'Perc', 'Amount', 'Date'];
      const rows = referralData.map((d) => [
        d.trans_id,
        d.username,
        d.from_username,
        d.perc,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Referral Commission Ledger', headers, rows, 'Referral_Commission_Report');
    } else if (activeTab === 'level') {
      const headers = ['Trans Id', 'User', 'From User', 'Level', 'Amount', 'Date'];
      const rows = levelData.map((d) => [
        d.trans_id,
        d.username,
        d.from_username,
        d.level,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Level Commission Ledger', headers, rows, 'Level_Commission_Report');
    } else if (activeTab === 'rank') {
      const headers = ['Trans Id', 'User', 'Rank', 'Reward Item', 'Amount', 'Date'];
      const rows = rankData.map((d) => [
        d.trans_id,
        d.username,
        d.rank_name,
        d.reward_name,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Rank Reward Distribution Ledger', headers, rows, 'Rank_Reward_Report');
    } else {
      const headers = ['Trans Id', 'User', 'Type', 'Amount', 'Date'];
      const rows = transData.map((d) => [
        d.trans_id,
        d.username,
        d.transaction_type,
        `$${d.amount.toFixed(2)}`,
        new Date(d.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Master Transaction Ledger', headers, rows, 'All_Transactions_Report');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Referral Commission */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Referral Commission
              </p>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                ${summary.referral.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {summary.referral.count} Direct Sponsor Payouts
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-blue-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>8% Direct Activation Payout</span>
          </div>
        </div>

        {/* Card 2: Level Commission */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Level Commission
              </p>
              <h3 className="text-xl font-black text-emerald-600 mt-1">
                ${summary.level.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {summary.level.count} Multi-Tier Matrix Distributions
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Level 1 to 10 Distributions</span>
          </div>
        </div>

        {/* Card 3: Rank Reward */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Rank Rewards Given
              </p>
              <h3 className="text-xl font-black text-amber-500 mt-1">
                ${summary.rankReward.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {summary.rankReward.count} Approved Cash & Gifts
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Achievement Tier Rewards</span>
          </div>
        </div>

        {/* Card 4: Filtered Total Amount Banner (Matching Laravel alert alert-success text-right) */}
        <div className="bg-gradient-to-br from-[#172b4c] to-[#0c1b30] text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Filtered Total Amount
              </span>
              <Receipt className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              ${filteredTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Across {totalCount} matching {activeTab === 'all' ? 'transaction' : 'bonus'} records
            </p>
          </div>
          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-white/10 flex items-center justify-between">
            <span>Filter: {activeSearch ? `"${activeSearch}"` : 'All'}</span>
            <span className="capitalize">{activeTab}</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER & TAB NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            {activeTab === 'referral'
              ? 'Referral Commission Report'
              : activeTab === 'level'
              ? 'Level Commission Report'
              : activeTab === 'rank'
              ? 'Rank Reward Distribution Report'
              : 'All Transactions Ledger'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin / Reports & Bonuses • Auditable ledger for network bonuses and platform transactions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate('/admin/reports/referral')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'referral'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Referral</span>
              <span className="bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.referral.count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/reports/level')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'level'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Level</span>
              <span className="bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.level.count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/reports/rank-reward')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rank'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rank Reward</span>
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.rankReward.count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/reports/protocol-fee')}
              className="px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
              title="1% Protocol Fee (8th Level) Master Ledger"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>1% Protocol Fee</span>
              {summary.protocolFee && (
                <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                  {summary.protocolFee.count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/reports/transactions')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>All Transactions</span>
              <span className="bg-slate-700 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.transactions.count}
              </span>
            </button>
          </div>

          {/* Export Buttons */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchRecords()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. FILTER BAR (Matches Laravel lines 43-80 in bonus_report.blade.php) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className={activeTab === 'all' ? 'md:col-span-4' : 'md:col-span-5'}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">UserId / Keyword</label>
            <div className="relative">
              <input
                type="text"
                value={searchUname}
                onChange={(e) => setSearchUname(e.target.value)}
                placeholder="Search by Username, Email, or Transaction ID..."
                className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] transition bg-slate-50/50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {activeTab === 'all' && (
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Transaction Type</label>
              <select
                value={txTypeFilter}
                onChange={(e) => {
                  setTxTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] transition bg-slate-50/50"
              >
                <option value="">All Types</option>
                <option value="blockchain_deposit">Blockchain Deposit</option>
                <option value="donation_deposit_wallet">Donation Entry</option>
                <option value="donation_return">Donation Return (162%)</option>
                <option value="recommit_donation">Recommit Donation</option>
                <option value="epin_buy">E-Pin Purchase</option>
                <option value="referral_commission">Referral Commission</option>
                <option value="level_commission">Level Commission</option>
                <option value="manual_deposit_approved">Manual Deposit</option>
              </select>
            </div>
          )}

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Of Rows</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] transition bg-slate-50/50"
            >
              <option value="10">10 Rows</option>
              <option value="25">25 Rows</option>
              <option value="50">50 Rows</option>
              <option value="100">100 Rows</option>
              <option value="200">200 Rows</option>
            </select>
          </div>

          <div className={activeTab === 'all' ? 'md:col-span-2 flex items-center gap-2' : 'md:col-span-4 flex items-center gap-2'}>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ffa800] hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            {(activeSearch || txTypeFilter) && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 4. MAIN DATA TABLE (Matching bonus_report.blade.php & transactions.blade.php) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            {activeTab === 'referral'
              ? 'Referral Commission Records'
              : activeTab === 'level'
              ? 'Level Commission Records'
              : activeTab === 'rank'
              ? 'Rank Reward Distribution Records'
              : 'Platform Transaction Ledger'}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Total {totalCount} Records {activeSearch ? `(Filtered by "${activeSearch}")` : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          {/* Tab 1: Referral Commission Table */}
          {activeTab === 'referral' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">From User</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Percent</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      <span className="font-semibold text-xs">Loading referral commissions...</span>
                    </td>
                  </tr>
                ) : referralData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-blue-500" />
                      <p className="font-bold text-sm text-slate-700">No referral commission records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No referral commissions exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  referralData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.trans_id}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.fullname}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {row.from_username}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{row.level}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {row.perc}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">${row.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Tab 2: Level Commission Table */}
          {activeTab === 'level' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">From User</th>
                  <th className="py-3 px-4">Generation</th>
                  <th className="py-3 px-4">Percent</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                      <span className="font-semibold text-xs">Loading level commissions...</span>
                    </td>
                  </tr>
                ) : levelData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-500" />
                      <p className="font-bold text-sm text-slate-700">No level commission records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No level commissions exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  levelData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.trans_id}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.fullname}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {row.from_username}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {row.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{row.perc}</td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">${row.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Tab 3: Rank Reward Table */}
          {activeTab === 'rank' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Rank Tier</th>
                  <th className="py-3 px-4">Reward Item</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                      <span className="font-semibold text-xs">Loading rank reward distributions...</span>
                    </td>
                  </tr>
                ) : rankData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Award className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-500" />
                      <p className="font-bold text-sm text-slate-700">No rank rewards found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No distributed rank rewards exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  rankData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.trans_id}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.fullname}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 border border-purple-200">
                          {row.rank_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{row.reward_name}</td>
                      <td className="py-3 px-4 font-black text-amber-600 text-sm">${row.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Tab 4: All Transactions Table */}
          {activeTab === 'all' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Fee / Charge</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-500" />
                      <span className="font-semibold text-xs">Loading transaction ledger...</span>
                    </td>
                  </tr>
                ) : transData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                      <p className="font-bold text-sm text-slate-700">No transactions found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No transactions exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  transData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.trans_id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.fullname}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {row.transaction_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">${row.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-rose-600 font-semibold">
                        {row.charge > 0 ? `$${row.charge.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={row.description}>
                        {row.description}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing Page {currentPage} of {totalPages} ({totalCount} total entries)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="px-3 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                {currentPage}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
