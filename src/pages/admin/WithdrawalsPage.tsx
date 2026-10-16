import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  Send,
  ExternalLink,
  Search,
  RefreshCw,
  Wallet,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import adminWithdrawService, {
  type WithdrawalRecord,
  type WithdrawalStats,
} from '../../services/adminWithdrawService';

export const WithdrawalsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from pathname
  const getTabFromPath = (): 'pending' | 'history' => {
    if (location.pathname.includes('/history')) return 'history';
    return 'pending';
  };

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>(getTabFromPath());
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [stats, setStats] = useState<WithdrawalStats>({
    pending_total_count: 0,
    pending_total_amount: 0,
    approved_total_count: 0,
    approved_total_amount: 0,
    rejected_total_count: 0,
    rejected_total_amount: 0,
    total_count: 0,
  });

  // Filter & Pagination States
  const [searchUserId, setSearchUserId] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('50');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail View State (matches withdraw_detail.blade.php)
  const [selectedRecord, setSelectedRecord] = useState<WithdrawalRecord | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState('');
  const [processMessage, setProcessMessage] = useState('processed');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync tab with route changes
  useEffect(() => {
    const nextTab = getTabFromPath();
    setActiveTab(nextTab);
    setCurrentPage(1);
  }, [location.pathname]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 1500);
  };

  // Fetch withdrawals from backend API
  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminWithdrawService.getWithdrawals({
        tab: activeTab,
        uname: activeSearch,
        page: currentPage,
        limit: parseInt(rowsPerPage) || 50,
      });

      if (res.success) {
        setRecords(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotalCount(res.meta.total || 0);
        }
      }
    } catch (err: any) {
      console.error('Failed to load withdrawals:', err);
      showToast(err.message || 'Error loading withdrawal records.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeSearch, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchUserId.trim());
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchUserId('');
    setActiveSearch('');
    setCurrentPage(1);
  };

  // Moderation: Approve Payout
  const handleApprove = async () => {
    if (!selectedRecord) return;
    setSubmittingAction(true);
    try {
      const res = await adminWithdrawService.processWithdrawal(selectedRecord.id, {
        status: 'approved',
        message: processMessage || 'processed',
        transaction_hash: approvalTxHash.trim() || undefined,
      });

      if (res.success) {
        showToast(`Withdrawal #${selectedRecord.withdraw_id} approved successfully!`);
        setSelectedRecord(null);
        setApprovalTxHash('');
        setProcessMessage('processed');
        fetchWithdrawals();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to approve withdrawal.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Moderation: Reject & Refund Payout
  const handleReject = async () => {
    if (!selectedRecord) return;
    if (!processMessage.trim()) {
      showToast('Please specify a rejection reason in the message field.', 'error');
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await adminWithdrawService.processWithdrawal(selectedRecord.id, {
        status: 'rejected',
        message: processMessage.trim(),
      });

      if (res.success) {
        showToast(res.message || `Withdrawal #${selectedRecord.withdraw_id} has been rejected and refunded.`);
        setSelectedRecord(null);
        setProcessMessage('processed');
        setApprovalTxHash('');
        fetchWithdrawals();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to reject withdrawal.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Export handlers
  const handleExportExcel = () => {
    const headers = [
      'Withdraw Id',
      'Date',
      'User Id',
      'User Name',
      'Requested Amount',
      'Withdraw Charge',
      'Send Amount',
      'Status',
      'Payment Status',
      'Wallet Address',
      'Transaction Hash',
    ];
    const rows = records.map((r) => [
      r.withdraw_id,
      new Date(r.created_at).toLocaleString(),
      r.username || String(r.user_id),
      r.first_name ? `${r.first_name} ${r.last_name || ''}`.trim() : r.username,
      `$${Number(r.total_amount).toFixed(2)}`,
      `$${Number(r.charge).toFixed(2)}`,
      `$${Number(r.amount).toFixed(2)}`,
      r.status,
      r.payment_status,
      r.wallet_address || '-',
      r.transaction_hash || '-',
    ]);
    exportTableToExcel(headers, rows, `Withdrawals_${activeTab.toUpperCase()}_Ledger`);
  };

  const handleExportPDF = () => {
    const headers = [
      'Withdraw Id',
      'Date',
      'User Id',
      'Requested',
      'Charge',
      'Send Amount',
      'Status',
      'Payment',
    ];
    const rows = records.map((r) => [
      r.withdraw_id,
      new Date(r.created_at).toLocaleDateString(),
      r.username || String(r.user_id),
      `$${Number(r.total_amount).toFixed(2)}`,
      `$${Number(r.charge).toFixed(2)}`,
      `$${Number(r.amount).toFixed(2)}`,
      r.status,
      r.payment_status,
    ]);
    exportTableToPDF('USDT Withdrawals Ledger', headers, rows, `Withdrawals_${activeTab.toUpperCase()}_Report`);
  };

  const formatShortAddress = (addr?: string) => {
    if (!addr) return '-';
    if (addr.length <= 14) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-white animate-in fade-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#172b4c] border-emerald-500/30'
              : 'bg-rose-950 border-rose-500/50'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. VIEW WITHDRAW DETAILS PAGE (Matching withdraw_detail.blade.php) */}
      {selectedRecord ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Back to Withdrawals List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Withdraw Details (#{selectedRecord.withdraw_id})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit member USDT transfer request, destination address, and confirm blockchain payout.
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedRecord.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : selectedRecord.status === 'pending' || selectedRecord.status === '0'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {selectedRecord.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Details Left Column (Exact match to lines 35-155 in withdraw_detail.blade.php) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-rose-600" />
                  Transaction Specification Ledger
                </h3>
                <span className="text-[11px] font-mono text-slate-400">ID #{selectedRecord.id}</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600 w-44">Withdraw Id</th>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{selectedRecord.withdraw_id}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-600">User Name</th>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {selectedRecord.first_name ? `${selectedRecord.first_name} ${selectedRecord.last_name || ''}`.trim() : selectedRecord.username}{' '}
                      <span className="font-mono text-blue-700 font-bold">[{selectedRecord.username}]</span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600">Amount Need to Transfer</th>
                    <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                      ${Number(selectedRecord.amount).toFixed(2)} USDT
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-600">Charge Of Withdraw</th>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      ${Number(selectedRecord.charge).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600">Total Requested Amount</th>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${Number(selectedRecord.total_amount).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-600">Withdraw Wallet</th>
                    <td className="py-3 px-4">
                      {selectedRecord.withdraw_wallet === 'donation_wallet' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                          Donation Wallet
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Main Balance
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600">Withdraw Currency</th>
                    <td className="py-3 px-4 font-bold text-slate-800 uppercase">
                      {selectedRecord.method_name || 'USDT (BEP-20)'}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-600">Destination Wallet Address</th>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 break-all select-all">
                          {selectedRecord.wallet_address || '-'}
                        </span>
                        {selectedRecord.wallet_address && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedRecord.wallet_address)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0 cursor-pointer"
                              title="Copy Wallet Address"
                            >
                              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={`https://bscscan.com/address/${selectedRecord.wallet_address}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 transition shrink-0"
                              title="View on BscScan"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600">Given Processing Time</th>
                    <td className="py-3 px-4 text-slate-700">{selectedRecord.processing_time || 'Instant'}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-600">Date Of Creation</th>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {new Date(selectedRecord.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/30">
                    <th className="py-3 px-4 font-bold text-slate-600">Status</th>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          selectedRecord.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedRecord.status === 'pending' || selectedRecord.status === '0'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {selectedRecord.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  {selectedRecord.transaction_hash && (
                    <tr>
                      <th className="py-3 px-4 font-bold text-slate-600">Transaction Hash</th>
                      <td className="py-3 px-4">
                        <a
                          href={`https://bscscan.com/tx/${selectedRecord.transaction_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <span>{formatShortAddress(selectedRecord.transaction_hash)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  )}
                  {selectedRecord.comment && (
                    <tr className="bg-slate-50/30">
                      <th className="py-3 px-4 font-bold text-slate-600">Remark / Notes</th>
                      <td className="py-3 px-4 text-slate-700">{selectedRecord.comment}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Laravel Notice banner line 147 */}
              <div className="p-4 bg-rose-50 border-t border-rose-100">
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  Charge Already taken. Send ${Number(selectedRecord.amount).toFixed(2)} USDT To The User.
                </p>
              </div>
            </div>

            {/* Moderation Form Right Column (Lines 158-197 in withdraw_detail.blade.php) */}
            <div className="lg:col-span-5 space-y-4">
              {selectedRecord.status === 'pending' || selectedRecord.status === '0' ? (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-emerald-600" /> Withdrawal Action
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Approve on-chain payout or reject and return funds to user's wallet.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Message / Remark <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={processMessage}
                        onChange={(e) => setProcessMessage(e.target.value)}
                        placeholder="Enter message or remarks for user"
                        rows={3}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Blockchain Tx Hash / UTR (Optional)
                      </label>
                      <input
                        type="text"
                        value={approvalTxHash}
                        onChange={(e) => setApprovalTxHash(e.target.value)}
                        placeholder="e.g. 0xba56437fcfe4ba46119c..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none font-mono focus:border-[#ffa800] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={handleApprove}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Approve Payout
                      </button>

                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={handleReject}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Request
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 italic text-center">
                      Note: Rejection will automatically refund ${Number(selectedRecord.total_amount).toFixed(2)} to the member's wallet balance.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Processing Record Completed
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Resolution Status:</span>
                      <span className="font-bold uppercase text-slate-800">{selectedRecord.status}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Payment Status:</span>
                      <span className="font-bold capitalize text-slate-800">{selectedRecord.payment_status}</span>
                    </div>
                    {selectedRecord.transaction_hash && (
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                          Blockchain Hash
                        </span>
                        <span className="font-mono text-xs text-slate-900 break-all font-semibold">
                          {selectedRecord.transaction_hash}
                        </span>
                      </div>
                    )}
                    {selectedRecord.comment && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                          Admin Remarks
                        </span>
                        <p className="text-xs text-slate-700 italic">"{selectedRecord.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. MAIN WITHDRAWALS TABLE (Matching withdraw_usdt.blade.php & withdraw_usdt_log.blade.php) */
        <>
          {/* Total Pending Withdrawals Banner (Lines 28-44 in Laravel withdraw_usdt.blade.php) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-800">Total Pending Withdrawals</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Amount to be deposited into the commission payout vault
              </p>
            </div>
            <div className="text-left sm:text-right">
              <h3 className="text-2xl font-black text-rose-600">
                ${stats.pending_total_amount.toFixed(2)}
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {stats.pending_total_count} Pending Request(s)
              </span>
            </div>
          </div>

          {/* Header bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-600" />
                {activeTab === 'pending' ? 'Pending USDT Withdraw' : 'Withdraw USD Log'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin / Withdrawals • Moderate user USDT requests and track broadcast transactions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => navigate('/admin/withdrawals/pending')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-[#172b4c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Pending Payouts</span>
                  {stats.pending_total_count > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold text-[10px]">
                      {stats.pending_total_count}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/withdrawals/history')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-[#172b4c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Withdrawal History
                </button>
              </div>

              {/* DataTables Export Buttons */}
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

              <button
                type="button"
                onClick={() => fetchWithdrawals()}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                title="Refresh Table"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Bar (Lines 55-85 in Laravel) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">UserId / Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                    placeholder="Enter UserId, Tx Code or Wallet..."
                    className="w-full text-xs pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ffa800] transition bg-slate-50/50"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

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

              <div className="md:col-span-5 flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ffa800] hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" /> Search
                </button>
                {activeSearch && (
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

          {/* Table View matching Laravel lines 90-104 & lines 205-259 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {activeTab === 'pending' ? 'Pending USDT Withdrawals' : 'Withdraw USD Log (History)'}
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Total {totalCount} Records {activeSearch ? `(Filtered by "${activeSearch}")` : ''}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                    <th className="py-3 px-4">Withdraw Id</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">User Id</th>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Requested Amount</th>
                    <th className="py-3 px-4">Withdraw Charge</th>
                    <th className="py-3 px-4">Send Amount</th>
                    {activeTab === 'history' && <th className="py-3 px-4">Tx Hash</th>}
                    <th className="py-3 px-4">Wallet</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Payment Status</th>
                    <th className="py-3 px-4 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={activeTab === 'history' ? 12 : 11} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                        <span className="font-semibold text-xs">Loading live withdrawal transactions...</span>
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'history' ? 12 : 11} className="py-12 text-center text-slate-400">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30 text-rose-500" />
                        <p className="font-bold text-sm text-slate-700">No withdrawal records found</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {activeTab === 'pending'
                            ? 'There are currently no pending payouts awaiting admin clearance.'
                            : 'No processed withdrawal history matching the selected criteria.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    records.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition">
                        {/* 1. Withdraw Id */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {row.withdraw_id}
                        </td>

                        {/* 2. Date */}
                        <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                          {new Date(row.created_at).toLocaleString()}
                        </td>

                        {/* 3. User Id */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                            {row.username || String(row.user_id)}
                          </span>
                        </td>

                        {/* 4. User Name */}
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {row.first_name ? `${row.first_name} ${row.last_name || ''}`.trim() : row.username}
                        </td>

                        {/* 5. Requested Amount */}
                        <td className="py-3 px-4 font-black text-slate-900">
                          ${Number(row.total_amount).toFixed(2)}
                        </td>

                        {/* 6. Withdraw Charge */}
                        <td className="py-3 px-4 text-rose-600 font-semibold">
                          ${Number(row.charge).toFixed(2)}
                        </td>

                        {/* 7. Send Amount */}
                        <td className="py-3 px-4 font-black text-emerald-600">
                          ${Number(row.amount).toFixed(2)}
                        </td>

                        {/* Tx Hash (History Tab Only) */}
                        {activeTab === 'history' && (
                          <td className="py-3 px-4">
                            {row.transaction_hash ? (
                              <a
                                href={`https://bscscan.com/tx/${row.transaction_hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                                title={row.transaction_hash}
                              >
                                <span>{formatShortAddress(row.transaction_hash)}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        )}

                        {/* Wallet Badge */}
                        <td className="py-3 px-4">
                          {row.withdraw_wallet === 'donation_wallet' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                              Donation Wallet
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Main Balance
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              row.status === 'approved' || row.status === '1'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : row.status === 'pending' || row.status === '0'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {row.status === 'approved' || row.status === '1'
                              ? 'Approved'
                              : row.status === 'pending' || row.status === '0'
                              ? 'Pending'
                              : 'Rejected'}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              row.payment_status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.payment_status === 'pending' || row.payment_status === 'pending_payout'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {row.payment_status === 'completed'
                              ? 'Completed'
                              : row.payment_status === 'pending_payout' || row.payment_status === 'pending'
                              ? 'Pending Payout'
                              : 'Failed'}
                          </span>
                        </td>

                        {/* Action: view badge */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRecord(row);
                              setApprovalTxHash(row.transaction_hash || '');
                              setProcessMessage(row.comment || 'processed');
                            }}
                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-full transition cursor-pointer shadow-xs"
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default WithdrawalsPage;
