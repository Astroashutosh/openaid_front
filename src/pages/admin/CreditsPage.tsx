import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  
  Plus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  X,
  Send,
  User as UserIcon,
  Shield,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import { adminCreditService } from '../../services/adminCreditService';
import type {
  UnallottedCreditItem,
  TransferredCreditItem,
  UsedCreditItem,
  ActiveCreditPackage,
  CreditPagination,
} from '../../services/adminCreditService';

export const CreditsPage: React.FC = () => {
  const location = useLocation();

  // Route page mode detection matching Laravel URLs:
  const isTransferPage =
    location.pathname.includes('/transfer') || location.pathname.includes('/transferred/pin');
  const isUsedPage =
    location.pathname.includes('/used') || location.pathname.includes('/my-used-pin');
  // Otherwise it's Generated Credits (/credits/generated or /transaction/pin)

  // Data states
  const [unallotted, setUnallotted] = useState<UnallottedCreditItem[]>([]);
  const [transfers, setTransfers] = useState<TransferredCreditItem[]>([]);
  const [usedList, setUsedList] = useState<UsedCreditItem[]>([]);

  // Active packages for modals
  const [packages, setPackages] = useState<ActiveCreditPackage[]>([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [pagination, setPagination] = useState<CreditPagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  // Search & filter
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. "Generate Credits" Modal State (for Unallotted Generated Credits)
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genPackageId, setGenPackageId] = useState<number | ''>('');
  const [genQuantity, setGenQuantity] = useState(1);
  const [submittingGen, setSubmittingGen] = useState(false);

  // 2. "Transfer Credits to Member" Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferUsername, setTransferUsername] = useState('');
  const [transferPackageId, setTransferPackageId] = useState<number | ''>('');
  const [transferQuantity, setTransferQuantity] = useState(1);
  const [userChecking, setUserChecking] = useState(false);
  const [userStatusText, setUserStatusText] = useState<{ valid: boolean; text: string } | null>(null);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load packages once for modals
  useEffect(() => {
    let mounted = true;
    adminCreditService
      .getActivePackages()
      .then((data) => {
        if (mounted) {
          setPackages(data);
          if (data.length > 0) {
            setGenPackageId(data[0].id);
            setTransferPackageId(data[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load packages for credits modal:', err));
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch page data based on current route
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isTransferPage) {
        const res = await adminCreditService.getTransferredCredits({
          page,
          limit,
          search: debouncedSearch,
        });
        setTransfers(res.data);
        setPagination(res.pagination);
      } else if (isUsedPage) {
        const res = await adminCreditService.getUsedCredits({
          page,
          limit,
          search: debouncedSearch,
        });
        setUsedList(res.data);
        setPagination(res.pagination);
      } else {
        const res = await adminCreditService.getUnallottedCredits({
          page,
          limit,
          search: debouncedSearch,
        });
        setUnallotted(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading credit records', 'error');
    } finally {
      setLoading(false);
    }
  }, [isTransferPage, isUsedPage, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when route changes
  useEffect(() => {
    setPage(1);
    setSearch('');
    setDebouncedSearch('');
  }, [location.pathname]);

  // Copy Pin Code
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Delete Unallotted Credit (matching Laravel pin_remove)
  const handleDeleteCredit = async (id: number, code: string) => {
    if (!window.confirm(`Are you sure you want to delete Credit ${code}?`)) return;
    try {
      await adminCreditService.deleteCredit(id);
      showToast(`Credit ${code} removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Unable to remove credit', 'error');
    }
  };

  // Handle Generate Credits Submit
  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genPackageId) {
      showToast('Please select an entry package tier.', 'error');
      return;
    }
    setSubmittingGen(true);
    try {
      const res = await adminCreditService.generateCredits({
        package_id: Number(genPackageId),
        quantity: Number(genQuantity),
      });
      showToast(res.message);
      setShowGenerateModal(false);
      setGenQuantity(1);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to generate credits', 'error');
    } finally {
      setSubmittingGen(false);
    }
  };

  // Live member username lookup (debounce)
  useEffect(() => {
    if (!showTransferModal || !transferUsername.trim()) {
      setUserStatusText(null);
      setUserChecking(false);
      return;
    }

    const timer = setTimeout(async () => {
      setUserChecking(true);
      try {
        const res = await adminCreditService.checkMember(transferUsername);
        if (res.valid && res.data) {
          setUserStatusText({
            valid: true,
            text: `✓ Verified: ${res.data.name} (${res.data.username}) - [${res.data.status}]`,
          });
        } else {
          setUserStatusText({
            valid: false,
            text: res.message || 'Destination member not found. Please enter a valid username.',
          });
        }
      } catch {
        setUserStatusText({
          valid: false,
          text: 'Unable to verify member username.',
        });
      } finally {
        setUserChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [transferUsername, showTransferModal]);

  // Handle Transfer Credits Submit
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferUsername.trim()) {
      showToast('Please enter destination member username or User ID.', 'error');
      return;
    }
    if (!transferPackageId) {
      showToast('Please select an entry package tier.', 'error');
      return;
    }
    setSubmittingTransfer(true);
    try {
      const res = await adminCreditService.transferCredits({
        username: transferUsername.trim(),
        package_id: Number(transferPackageId),
        quantity: Number(transferQuantity),
      });
      showToast(res.message);
      setShowTransferModal(false);
      setTransferUsername('');
      setTransferQuantity(1);
      setUserStatusText(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to transfer credits', 'error');
    } finally {
      setSubmittingTransfer(false);
    }
  };

  // Calculation preview helpers
  const selectedGenPkg = packages.find((p) => p.id === Number(genPackageId));
  const selectedTransferPkg = packages.find((p) => p.id === Number(transferPackageId));

  // EXPORT UTILITIES (Pure data from current view)
  const handleExportExcel = () => {
    if (isTransferPage) {
      const headers = [
        '#',
        'Credit Code',
        'Package',
        'Credit Value',
        'Transferred By',
        'Transferred To',
        'Transfer Date',
        'Status',
      ];
      const rows = transfers.map((t, i) => [
        (page - 1) * limit + i + 1,
        t.pinCode,
        t.packageTitle,
        `$${t.price.toFixed(2)}`,
        t.transferredBy,
        t.transferredTo,
        t.transferDate ? new Date(t.transferDate).toISOString().replace('T', ' ').slice(0, 19) : '--',
        t.statusText,
      ]);
      exportTableToExcel(headers, rows, 'Credit_Transfer_Log');
    } else if (isUsedPage) {
      const headers = ['#', 'Credit Code', 'Credit Value', 'Consumed By Member', 'Status', 'Used Date'];
      const rows = usedList.map((u, i) => [
        (page - 1) * limit + i + 1,
        u.pinCode,
        `$${u.price.toFixed(2)}`,
        `${u.consumedByUsername} (${u.consumedByFullName})`,
        u.status,
        u.updatedAt ? new Date(u.updatedAt).toISOString().replace('T', ' ').slice(0, 19) : '--',
      ]);
      exportTableToExcel(headers, rows, 'Used_Credits_Log');
    } else {
      const headers = ['#', 'Credit Code', 'Credit Package', 'Credit Value', 'Status', 'Created Date'];
      const rows = unallotted.map((c, i) => [
        (page - 1) * limit + i + 1,
        c.pinCode,
        c.packageTitle,
        `$${c.price.toFixed(2)}`,
        c.status === 0 ? 'Available' : 'Used',
        c.createdAt ? new Date(c.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '--',
      ]);
      exportTableToExcel(headers, rows, 'Unallotted_Credits');
    }
  };

  const handleExportPDF = () => {
    if (isTransferPage) {
      const headers = [
        '#',
        'Credit Code',
        'Package',
        'Credit Value',
        'Transferred By',
        'Transferred To',
        'Transfer Date',
        'Status',
      ];
      const rows = transfers.map((t, i) => [
        (page - 1) * limit + i + 1,
        t.pinCode,
        t.packageTitle,
        `$${t.price.toFixed(2)}`,
        t.transferredBy,
        t.transferredTo,
        t.transferDate ? new Date(t.transferDate).toISOString().replace('T', ' ').slice(0, 19) : '--',
        t.statusText,
      ]);
      exportTableToPDF('Credit Transfer Audit Log Report', headers, rows, 'Credit_Transfer_Log');
    } else if (isUsedPage) {
      const headers = ['#', 'Credit Code', 'Credit Value', 'Consumed By Member', 'Status', 'Used Date'];
      const rows = usedList.map((u, i) => [
        (page - 1) * limit + i + 1,
        u.pinCode,
        `$${u.price.toFixed(2)}`,
        `${u.consumedByUsername} (${u.consumedByFullName})`,
        u.status,
        u.updatedAt ? new Date(u.updatedAt).toISOString().replace('T', ' ').slice(0, 19) : '--',
      ]);
      exportTableToPDF('Used Credits Audit Report', headers, rows, 'Used_Credits_Log');
    } else {
      const headers = ['#', 'Credit Code', 'Credit Package', 'Credit Value', 'Status', 'Created Date'];
      const rows = unallotted.map((c, i) => [
        (page - 1) * limit + i + 1,
        c.pinCode,
        c.packageTitle,
        `$${c.price.toFixed(2)}`,
        c.status === 0 ? 'Available' : 'Used',
        c.createdAt ? new Date(c.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '--',
      ]);
      exportTableToPDF('Unallotted Transaction Credits Report', headers, rows, 'Unallotted_Credits');
    }
  };

  // Helper date formatter
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '--';
    try {
      const d = new Date(dateStr);
      return d.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      return dateStr;
    }
  };

  // Render pagination footer
  const renderPagination = () => {
    const { total, totalPages } = pagination;
    const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
    const endIdx = Math.min(page * limit, total);

    return (
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
        <div>
          Showing <span className="font-bold text-slate-900">{startIdx}</span> to{' '}
          <span className="font-bold text-slate-900">{endIdx}</span> of{' '}
          <span className="font-bold text-slate-900">{total}</span> entries
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
            {page} / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 1: CREDIT TRANSFER LOG (Exact view matching transferred_pins.blade.php)
  // =========================================================================
  if (isTransferPage) {
    return (
      <div className="w-full space-y-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-16 right-6 z-50 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 ${
              toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-[#0c2c23] border border-emerald-500/30'
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

        {/* Content Header & Breadcrumb (Matching Laravel) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="text-lg font-bold text-slate-800">Credit Transfer Log</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
              <Link to="/admin" className="hover:text-slate-800 transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/admin/credits/generated" className="hover:text-slate-800 transition">
                Credits
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Credit Transfer</span>
            </div>
          </div>
        </div>

        {/* Card Box (Matching Laravel box structure) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Box Header */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Credit Transfer Log</h3>
              <p className="text-[11px] text-slate-500 mb-0">
                Audit log of all Credits allotted or transferred between users and admin.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                title="Refresh table"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button
                type="button"
                onClick={() => setShowTransferModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0c2c23] hover:bg-[#0c2c23]/90 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" /> Transfer Credits to Member
              </button>
            </div>
          </div>

          {/* Table Controls (Entries selector, Excel, PDF, Search) */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>

              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
                title="Export table data to Excel (.csv)"
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

            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <label className="text-xs text-slate-600 font-medium">Search:</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code or member..."
                className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23] w-full sm:w-48"
              />
            </div>
          </div>

          {/* Table (Exact columns matching transferred_pins.blade.php) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Credit Code</th>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Credit Value</th>
                  <th className="py-2.5 px-3">Transferred By</th>
                  <th className="py-2.5 px-3">Transferred To</th>
                  <th className="py-2.5 px-3">Transfer Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#0c2c23]" />
                        <span>Loading credit transfer audit log...</span>
                      </div>
                    </td>
                  </tr>
                ) : transfers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-slate-500 py-8">
                      No transferred Credits recorded yet.
                    </td>
                  </tr>
                ) : (
                  transfers.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded text-[11px]">
                            {t.pinCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(t.pinCode)}
                            className="text-slate-400 hover:text-slate-700"
                            title="Copy code"
                          >
                            {copiedCode === t.pinCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {t.packageTitle}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ${t.price.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        {t.allotByType === 'user' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-800">
                            <UserIcon className="w-3 h-3 text-slate-600" /> {t.transferredBy}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-900">
                            <Shield className="w-3 h-3 text-blue-700" /> {t.transferredBy}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 font-bold block">{t.transferredTo}</strong>
                        {t.transferredToName && t.transferredToName !== t.transferredTo && (
                          <span className="text-[10px] text-slate-500">{t.transferredToName}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(t.transferDate)}
                      </td>
                      <td className="py-2.5 px-3">
                        {t.pinStatus === 1 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Used
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active / Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>

        {/* ========================================================================= */}
        {/* TRANSFER CREDITS TO MEMBER MODAL (Matching transferred_pins.blade.php) */}
        {/* ========================================================================= */}
        {showTransferModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-sm">Transfer Credits to Member</h4>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleTransferSubmit} className="p-4 space-y-3.5">
                {/* 1. Member User ID / Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Member User ID / Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={transferUsername}
                      onChange={(e) => setTransferUsername(e.target.value)}
                      placeholder="Enter Member User ID / Username"
                      className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23]"
                    />
                    {userChecking && (
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                      </div>
                    )}
                  </div>
                  {userStatusText && (
                    <p
                      className={`text-[11px] font-semibold mt-1 ${
                        userStatusText.valid ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {userStatusText.text}
                    </p>
                  )}
                  <small className="text-slate-400 block text-[10px] mt-0.5">
                    Enter the username / User ID of the destination member.
                  </small>
                </div>

                {/* 2. Select Entry Package Tier */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Entry Package Tier <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={transferPackageId}
                    onChange={(e) => setTransferPackageId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23] bg-white"
                  >
                    <option value="">-- Choose Entry Tier --</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} - (${pkg.price.toFixed(2)}) [Credit: ${pkg.pinValue.toFixed(2)}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Number of Credits to Transfer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Credits to Transfer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23]"
                  />
                  <small className="text-slate-400 block text-[10px] mt-0.5">
                    Transfer up to 100 Credits at a time.
                  </small>
                </div>

                {/* 4. Calculation Preview Box (Exact match from Laravel blade) */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Donation Tier:</span>
                    <strong className="text-primary font-bold">
                      {selectedTransferPkg ? `$${selectedTransferPkg.price.toFixed(2)}` : '--'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Value per Credit (10%):</span>
                    <strong className="text-slate-800 font-bold">
                      {selectedTransferPkg ? `$${selectedTransferPkg.pinValue.toFixed(2)} / Credit` : '--'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 font-bold">
                    <span>Total Credits to Allot:</span>
                    <strong className="text-emerald-700 text-sm font-black">
                      {selectedTransferPkg
                        ? `${transferQuantity} ${
                            transferQuantity > 1 ? 'Credits' : 'Credit'
                          } ($${(transferQuantity * selectedTransferPkg.pinValue).toFixed(2)})`
                        : `${transferQuantity} ${transferQuantity > 1 ? 'Credits' : 'Credit'}`}
                    </strong>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTransfer}
                    className="px-4 py-1.5 bg-[#0c2c23] hover:bg-[#0c2c23]/90 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submittingTransfer ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transferring...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Complete Transfer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: USED CREDITS LOG (Matching used_pin.blade.php)
  // =========================================================================
  if (isUsedPage) {
    return (
      <div className="w-full space-y-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-16 right-6 z-50 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 ${
              toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-[#0c2c23] border border-emerald-500/30'
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

        {/* Content Header & Breadcrumb (Matching used_pin.blade.php) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="text-lg font-bold text-slate-800">Used Credits</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
              <Link to="/admin" className="hover:text-slate-800 transition">
                Home
              </Link>
              <span>/</span>
              <Link to="/admin/credits/generated" className="hover:text-slate-800 transition">
                Credits
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Used Credits</span>
            </div>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Box Header */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Used / Consumed Credits</h3>
              <p className="text-[11px] text-slate-500 mb-0">
                Record of all Credits that have been consumed for donation requests or activations.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              title="Refresh table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Table Controls */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>

              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
              >
                <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF
              </button>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <label className="text-xs text-slate-600 font-medium">Search:</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code or member..."
                className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23] w-full sm:w-48"
              />
            </div>
          </div>

          {/* Table (Columns matching used_pin.blade.php) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3">Credit Code</th>
                  <th className="py-2.5 px-3">Credit Value</th>
                  <th className="py-2.5 px-3">Consumed By Member</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Used / Updated Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#0c2c23]" />
                        <span>Loading used credit records...</span>
                      </div>
                    </td>
                  </tr>
                ) : usedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-500 py-8">
                      No used Credits recorded yet.
                    </td>
                  </tr>
                ) : (
                  usedList.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded text-[11px]">
                          {u.pinCode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ${u.price.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 font-bold block">{u.consumedByUsername}</strong>
                        {u.consumedByFullName && u.consumedByFullName !== u.consumedByUsername && (
                          <span className="text-[10px] text-slate-500">{u.consumedByFullName}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Consumed
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(u.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: GENERATED CREDITS (Matching trans_pin.blade.php)
  // =========================================================================
  return (
    <div className="w-full space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-6 z-50 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-[#0c2c23] border border-emerald-500/30'
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

      {/* Content Header & Breadcrumb (Matching trans_pin.blade.php) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-lg font-bold text-slate-800">Generated Credits</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
            <Link to="/admin" className="hover:text-slate-800 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Generated Credits</span>
          </div>
        </div>
      </div>

      {/* Card Box */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Box Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Unallotted Transaction Credits</h3>
            <p className="text-[11px] text-slate-500 mb-0">
              Credits available in system pool ready to be transferred or consumed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              title="Refresh table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0c2c23] hover:bg-[#0c2c23]/90 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Generate Credits
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <span>Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF
            </button>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <label className="text-xs text-slate-600 font-medium">Search:</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or package..."
              className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23] w-full sm:w-48"
            />
          </div>
        </div>

        {/* Table (Columns matching trans_pin.blade.php) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Credit Code</th>
                <th className="py-2.5 px-3">Credit Package</th>
                <th className="py-2.5 px-3">Credit Value</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created Date</th>
                <th className="py-2.5 px-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0c2c23]" />
                      <span>Loading unallotted credits...</span>
                    </div>
                  </td>
                </tr>
              ) : unallotted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-8">
                    No unallotted Credits found. Click "Generate Credits" to create a new batch.
                  </td>
                </tr>
              ) : (
                unallotted.map((pin, idx) => (
                  <tr key={pin.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded text-[11px]">
                          {pin.pinCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(pin.pinCode)}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy code"
                        >
                          {copiedCode === pin.pinCode ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {pin.packageTitle}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      ${pin.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      {pin.status === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Used
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDate(pin.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {pin.status === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteCredit(pin.id, pin.pinCode)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] transition border border-rose-200"
                          title="Delete Credit"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* ========================================================================= */}
      {/* GENERATE ACTIVATION CREDITS MODAL (Matching trans_pin.blade.php) */}
      {/* ========================================================================= */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">Generate Activation Credits</h4>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleGenerateSubmit} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Entry Package Tier <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={genPackageId}
                  onChange={(e) => setGenPackageId(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23] bg-white"
                >
                  <option value="">-- Choose Entry Tier --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - (${pkg.price.toFixed(2)}) [AC: ${pkg.pinValue.toFixed(2)}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Credits to Generate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={genQuantity}
                  onChange={(e) => setGenQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23]"
                />
                <small className="text-slate-400 block text-[10px] mt-0.5">
                  Generate up to 100 Credits at a time.
                </small>
              </div>

              {/* Calculation Preview Box (Exact match from Laravel blade) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Donation Tier:</span>
                  <strong className="text-primary font-bold">
                    {selectedGenPkg ? `$${selectedGenPkg.price.toFixed(2)}` : '--'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Value Per Credit (10%):</span>
                  <strong className="text-slate-800 font-bold">
                    {selectedGenPkg ? `$${selectedGenPkg.pinValue.toFixed(2)} / Credit` : '--'}
                  </strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 font-bold">
                  <span>Total Credits to Generate:</span>
                  <strong className="text-emerald-700 text-sm font-black">
                    {selectedGenPkg
                      ? `${genQuantity} ${genQuantity > 1 ? 'Credits' : 'Credit'} ($${(
                          genQuantity * selectedGenPkg.pinValue
                        ).toFixed(2)})`
                      : `${genQuantity} ${genQuantity > 1 ? 'Credits' : 'Credit'}`}
                  </strong>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGen}
                  className="px-4 py-1.5 bg-[#0c2c23] hover:bg-[#0c2c23]/90 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingGen ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Generate Now
                    </>
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
