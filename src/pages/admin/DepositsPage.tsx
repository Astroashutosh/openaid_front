import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Clock,
  Wallet,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Eye,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import {
  adminDepositService,
  type DepositItem,
  type DepositStats,
} from '../../services/adminDepositService';

export const DepositsPage: React.FC = () => {
  const location = useLocation();

  // Mode detection matching Laravel routes:
  // - /admin/deposits/pending or /admin/pending-deposits -> 'pending' (pending.blade.php)
  // - /admin/deposits/all or /admin/deposit-log -> 'all' (all.blade.php)
  const isPendingMode =
    location.pathname.includes('/pending') || location.pathname.includes('pending-deposits');
  const currentMode = isPendingMode ? 'pending' : 'all';

  // Server data state
  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [stats, setStats] = useState<DepositStats>({
    totalApprovedAmount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalCount: 0,
  });

  // Filters state
  const [unameSearch, setUnameSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [appliedStatus, setAppliedStatus] = useState('all');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // Modals state
  const [receiptModalImage, setReceiptModalImage] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<DepositItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch deposits from backend API
  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminDepositService.getDeposits({
        type: currentMode,
        status: currentMode === 'all' ? appliedStatus : undefined,
        search: appliedSearch,
        page,
        limit,
      });

      setDeposits(res.data);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch (err: any) {
      showToast(err.message || 'Failed to load deposits', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentMode, appliedStatus, appliedSearch, page, limit]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  // Reset pagination when mode changes
  useEffect(() => {
    setPage(1);
    setUnameSearch('');
    setAppliedSearch('');
    setSelectedStatus('all');
    setAppliedStatus('all');
  }, [location.pathname]);

  // Handle Search Filter Form Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(unameSearch.trim());
    setAppliedStatus(selectedStatus);
  };

  const handleResetFilters = () => {
    setUnameSearch('');
    setAppliedSearch('');
    setSelectedStatus('all');
    setAppliedStatus('all');
    setPage(1);
  };

  // Approve Deposit action
  const handleApprove = async (item: DepositItem) => {
    if (
      !window.confirm(
        `Are you sure you want to APPROVE deposit of $${item.amount.toFixed(
          2
        )} for ${item.username}?\n\nThis will immediately credit their Deposit Wallet.`
      )
    ) {
      return;
    }

    setApprovingId(item.id);
    try {
      const res = await adminDepositService.approveDeposit(item.id);
      showToast(res.message);
      fetchDeposits();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve deposit', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  // Submit Rejection
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejecting this deposit.', 'error');
      return;
    }

    setSubmittingReject(true);
    try {
      const res = await adminDepositService.rejectDeposit(rejectingItem.id, rejectReason.trim());
      showToast(res.message);
      setRejectingItem(null);
      setRejectReason('');
      fetchDeposits();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject deposit', 'error');
    } finally {
      setSubmittingReject(false);
    }
  };

  // Copy hash to clipboard
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Export handlers
  const handleExportExcel = () => {
    const headers = [
      'Transaction Id',
      'User Id',
      'User Name',
      'Amount ($)',
      'Payment Mode',
      'Transaction Hash',
      'Status',
      'Date',
    ];
    const rows = deposits.map((d) => [
      d.transId,
      d.username,
      d.fullName,
      d.amount.toFixed(2),
      d.paymentMode === 'blockchain' ? 'Instant Web3' : 'Manual Transfer',
      d.transactionHash || '-',
      d.status,
      formatDate(d.createdAt),
    ]);
    exportTableToExcel(headers, rows, `deposits_${currentMode}_${Date.now()}`);
  };

  const handleExportPDF = () => {
    const headers = [
      'Transaction Id',
      'User Id',
      'User Name',
      'Amount ($)',
      'Payment Mode',
      'Transaction Hash',
      'Status',
      'Date',
    ];
    const rows = deposits.map((d) => [
      d.transId,
      d.username,
      d.fullName,
      `$${d.amount.toFixed(2)}`,
      d.paymentMode === 'blockchain' ? 'Instant Web3' : 'Manual Transfer',
      d.transactionHash || '-',
      d.status,
      formatDate(d.createdAt),
    ]);
    exportTableToPDF(
      `${currentMode === 'pending' ? 'Pending Donate Requests' : 'All Donate History'} Report`,
      headers,
      rows,
      `deposits_${currentMode}_${Date.now()}`
    );
  };

  const formatDate = (dateStr?: string) => {
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
      return dateStr;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-6 z-50 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'error'
              ? 'bg-rose-600'
              : 'bg-[#0c2c23] border border-emerald-500/30'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Breadcrumb (Matching Laravel) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-lg font-bold text-slate-800">
            {isPendingMode ? 'Pending Donate Requests' : 'All Donate History'}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
            <Link to="/admin" className="hover:text-slate-800 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-500">Donate Now</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">
              {isPendingMode ? 'Pending Requests' : 'All History'}
            </span>
          </div>
        </div>

        {/* Top Toggle Button matching Laravel header buttons */}
        <div>
          {isPendingMode ? (
            <Link
              to="/admin/deposits/all"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
            >
              <span>All Donate History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/admin/deposits/pending"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-2xs transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Requests ({stats.pendingCount})</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Stat Cards: Displayed on All Donate History page (Exact match for Laravel all.blade.php) */}
      {!isPendingMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Approved Volume */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Approved Volume
              </p>
              <h3 className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
                ${stats.totalApprovedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Pending Requests */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Requests
              </p>
              <h3 className="text-lg font-bold text-amber-600 font-mono mt-0.5">
                {stats.pendingCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Approved Donate */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Approved Donate
              </p>
              <h3 className="text-lg font-bold text-[#0c2c23] font-mono mt-0.5">
                {stats.approvedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0c2c23] flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Rejected Donate */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Rejected Donate
              </p>
              <h3 className="text-lg font-bold text-rose-600 font-mono mt-0.5">
                {stats.rejectedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Card Box (Matching Laravel box structure) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Box Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isPendingMode
                ? `Pending Donate Requests (${stats.pendingCount})`
                : `Donate Records History (${stats.totalCount})`}
            </h3>
            <p className="text-[11px] text-slate-500 mb-0">
              {isPendingMode
                ? 'Review user-submitted USDT (BEP-20) transfers and approve or reject with reason.'
                : 'Unified ledger audit of all instant Web3 and manual deposits.'}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchDeposits}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            title="Refresh table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Search & Filter Toolbar: Exact Match for Laravel #searchform */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            {/* UserId / Transaction input */}
            <div className={!isPendingMode ? 'sm:col-span-5' : 'sm:col-span-6'}>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                UserId / Trans ID / Hash
              </label>
              <input
                type="text"
                value={unameSearch}
                onChange={(e) => setUnameSearch(e.target.value)}
                placeholder="Enter UserId, Trans ID, or Hash..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
              />
            </div>

            {/* Status dropdown (only for All History page) */}
            {!isPendingMode && (
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {/* Rows count */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                No. Of Rows
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Search and Reset Buttons (Matches Laravel #FF7A1A styling) */}
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <button
                type="submit"
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#FF7A1A] hover:bg-[#e56a12] text-white text-xs font-bold transition shadow-2xs text-center"
              >
                Search
              </button>
              {(appliedSearch || (appliedStatus !== 'all' && !isPendingMode)) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
                  title="Clear filters"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Export Toolbar */}
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>
            Total Entries:{' '}
            <strong className="text-slate-900">{pagination.total.toLocaleString()}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              title="Export table data to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              title="Export table data to PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3">Transaction Id</th>
                <th className="py-2.5 px-3">User Id</th>
                <th className="py-2.5 px-3">User Name</th>
                <th className="py-2.5 px-3">Amount</th>
                {!isPendingMode && <th className="py-2.5 px-3">Payment Mode</th>}
                <th className="py-2.5 px-3">Transaction Hash</th>
                <th className="py-2.5 px-3 text-center">Screenshot</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
                {isPendingMode ? (
                  <th className="py-2.5 px-3 text-center w-36">Action</th>
                ) : (
                  <th className="py-2.5 px-3">Notes</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={isPendingMode ? 9 : 10} className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0c2c23]" />
                      <span>Loading donate records...</span>
                    </div>
                  </td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={isPendingMode ? 9 : 10} className="text-center text-slate-500 py-8">
                    No {isPendingMode ? 'pending donate requests' : 'donate records'} found matching
                    criteria.
                  </td>
                </tr>
              ) : (
                deposits.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition">
                    {/* Transaction Id */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.transId}
                    </td>

                    {/* User ID (Link to Profile) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <Link
                        to={`/admin/profile/${row.userId}`}
                        className="font-mono font-bold text-[#0c2c23] hover:underline"
                        title="View member profile"
                      >
                        {row.username}
                      </Link>
                    </td>

                    {/* User Name */}
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {row.fullName}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      ${row.amount.toFixed(2)}
                    </td>

                    {/* Payment Mode (only on All page) */}
                    {!isPendingMode && (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {row.paymentMode === 'blockchain' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Instant Web3
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            Manual Transfer
                          </span>
                        )}
                      </td>
                    )}

                    {/* Transaction Hash */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                      {row.transactionHash ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://bscscan.com/tx/${row.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                            title={row.transactionHash}
                          >
                            <span>
                              {row.transactionHash.slice(0, 8)}...{row.transactionHash.slice(-6)}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyHash(row.transactionHash!)}
                            className="text-slate-400 hover:text-slate-600 transition"
                            title="Copy full transaction hash"
                          >
                            {copiedHash === row.transactionHash ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Screenshot Receipt */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {row.receiptUrl ? (
                        <button
                          type="button"
                          onClick={() => setReceiptModalImage(row.receiptUrl)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium transition"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      ) : row.paymentMode === 'blockchain' ? (
                        <span className="text-slate-400 text-[11px]">On-Chain</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No File</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {row.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Approved
                        </span>
                      ) : row.status === 'pending' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>

                    {/* Actions column on Pending / Notes column on All */}
                    {isPendingMode ? (
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Approve Button */}
                          <button
                            type="button"
                            disabled={approvingId === row.id}
                            onClick={() => handleApprove(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-[11px] font-bold transition shadow-2xs"
                            title="Approve and credit user deposit wallet"
                          >
                            {approvingId === row.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Approve</span>
                          </button>

                          {/* Reject Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingItem(row);
                              setRejectReason('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition shadow-2xs"
                            title="Reject deposit request"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    ) : (
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {row.status === 'rejected' && row.rejectReason ? (
                          <span
                            className="text-rose-600 font-medium truncate max-w-[150px] inline-block"
                            title={row.rejectReason}
                          >
                            {row.rejectReason}
                          </span>
                        ) : row.status === 'approved' ? (
                          <span className="text-emerald-700 font-medium">Credited</span>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-900">
              {pagination.total === 0 ? 0 : (page - 1) * limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(page * limit, pagination.total)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <span className="px-3 py-1 font-bold text-slate-800 bg-white border border-slate-300 rounded-lg">
              {page} / {pagination.totalPages || 1}
            </span>

            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREENSHOT PROOF LIGHTBOX MODAL (Matches Laravel adminReceiptModal) */}
      {/* ========================================================================= */}
      {receiptModalImage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>Payment Screenshot Proof</span>
              </h4>
              <button
                type="button"
                onClick={() => setReceiptModalImage(null)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100/60">
              <img
                src={receiptModalImage}
                alt="Payment Receipt"
                className="max-h-[550px] w-auto object-contain rounded-lg border border-slate-200 shadow-sm"
              />
            </div>

            <div className="flex justify-between items-center px-4 py-2.5 border-t border-slate-200 bg-slate-50">
              <a
                href={receiptModalImage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c2c23] hover:bg-[#143d32] text-white text-xs font-semibold transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Open Full Image
              </a>
              <button
                type="button"
                onClick={() => setReceiptModalImage(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECT REASON MODAL (Matches Laravel adminRejectModal) */}
      {/* ========================================================================= */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-rose-600 text-white">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Reject Donate Request</span>
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
                <p className="text-slate-600">
                  You are rejecting Donate for{' '}
                  <strong className="text-slate-900">{rejectingItem.username}</strong> of{' '}
                  <strong className="text-rose-600 font-mono">
                    ${rejectingItem.amount.toFixed(2)}
                  </strong>
                  .
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reason for Rejection <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Transaction hash not found on blockchain, amount mismatch, invalid screenshot..."
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
                  />
                  <small className="text-slate-400 block mt-1">
                    This reason will be visible to the user on their Donate history page.
                  </small>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingReject ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Rejecting...
                    </>
                  ) : (
                    'Confirm Rejection'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositsPage;
