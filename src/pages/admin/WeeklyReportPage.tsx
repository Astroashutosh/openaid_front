import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  CreditCard,
  Users,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import adminWeeklyReportService, {
  type WeeklyReportSummary,
  type WeeklyDepositItem,
  type WeeklyCreditItem,
  type WeeklyDonationMatchItem,
} from '../../services/adminWeeklyReportService';

export const WeeklyReportPage: React.FC = () => {
  // Tab state: 'donate' | 'credits' | 'matches'
  const [activeTab, setActiveTab] = useState<'donate' | 'credits' | 'matches'>('donate');
  const [loading, setLoading] = useState(false);

  // Filter States
  const [userIdFilter, setUserIdFilter] = useState('');
  const [activeUserId, setActiveUserId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination & rows
  const [rowsPerPage, setRowsPerPage] = useState('20');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Summary Metrics
  const [summary, setSummary] = useState<WeeklyReportSummary>({
    from: '',
    to: '',
    formattedLabel: '',
    deposits: { count: 0, amount: 0 },
    creditPurchases: { count: 0, amount: 0 },
    makeDonations: { count: 0, amount: 0 },
  });

  // Data lists
  const [depositData, setDepositData] = useState<WeeklyDepositItem[]>([]);
  const [creditData, setCreditData] = useState<WeeklyCreditItem[]>([]);
  const [matchData, setMatchData] = useState<WeeklyDonationMatchItem[]>([]);

  // Fetch report data
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const limit = parseInt(rowsPerPage) || 20;
      const res = await adminWeeklyReportService.getWeeklyReport({
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        user_id: activeUserId || undefined,
        tab: activeTab,
        page: currentPage,
        limit,
      });

      if (res.success) {
        setSummary(res.summary);
        // Sync dates if not explicitly set yet
        if (!fromDate) setFromDate(res.summary.from);
        if (!toDate) setToDate(res.summary.to);

        setTotalCount(res.meta.total);
        setTotalPages(res.meta.totalPages);

        if (activeTab === 'donate') {
          setDepositData(res.data as WeeklyDepositItem[]);
        } else if (activeTab === 'credits') {
          setCreditData(res.data as WeeklyCreditItem[]);
        } else {
          setMatchData(res.data as WeeklyDonationMatchItem[]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch weekly report:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fromDate, toDate, activeUserId, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Tab change handler
  const handleTabChange = (tab: 'donate' | 'credits' | 'matches') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Helper: Shift week by offset (-7 or +7 days)
  const shiftWeek = (dayOffset: number) => {
    if (!summary.from) return;
    const [y, m, d] = summary.from.split('-').map(Number);
    const currMon = new Date(y, m - 1, d);
    currMon.setDate(currMon.getDate() + dayOffset);

    const nextSun = new Date(currMon);
    nextSun.setDate(currMon.getDate() + 6);

    const toYMD = (dt: Date) =>
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

    setFromDate(toYMD(currMon));
    setToDate(toYMD(nextSun));
    setCurrentPage(1);
  };

  // Helper: Snap any date to its Monday and Sunday
  const handleDateChange = (type: 'from' | 'to', value: string) => {
    if (!value) {
      if (type === 'from') setFromDate('');
      if (type === 'to') setToDate('');
      return;
    }
    const [y, m, d] = value.split('-').map(Number);
    const anchor = new Date(y, m - 1, d);
    const day = anchor.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day;
    const mon = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + diffToMon);
    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);

    const toYMD = (dt: Date) =>
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

    setFromDate(toYMD(mon));
    setToDate(toYMD(sun));
  };

  // Form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveUserId(userIdFilter.trim());
    setCurrentPage(1);
  };

  // Reset to default
  const handleReset = () => {
    setUserIdFilter('');
    setActiveUserId('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (activeTab === 'donate') {
      const headers = ['#', 'Date & Time', 'User ID', 'User Name', 'Amount (USDT)', 'Transaction Hash', 'Status'];
      const rows = depositData.map((d, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(d.date).toLocaleString(),
        d.username,
        d.fullname,
        `$${d.amount.toFixed(2)}`,
        d.transaction_hash || '—',
        d.status,
      ]);
      exportTableToExcel(headers, rows, `Weekly_Donate_Report_${summary.from}_to_${summary.to}`);
    } else if (activeTab === 'credits') {
      const headers = ['#', 'Date & Time', 'User ID', 'User Name', 'Amount (USDT)', 'Transaction ID', 'Status'];
      const rows = creditData.map((c, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(c.date).toLocaleString(),
        c.username,
        c.fullname,
        `$${c.amount.toFixed(2)}`,
        c.trans_id,
        c.status,
      ]);
      exportTableToExcel(headers, rows, `Weekly_Credit_Purchases_Report_${summary.from}_to_${summary.to}`);
    } else {
      const headers = ['#', 'Date & Time', 'Sender ID', 'Sender Name', 'Donation Amount (USDT)', 'Receiver ID', 'Transaction ID', 'Status'];
      const rows = matchData.map((m, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(m.date).toLocaleString(),
        m.sender_username,
        m.sender_fullname,
        `$${m.amount.toFixed(2)}`,
        m.receiver_username,
        m.reference_no,
        m.status,
      ]);
      exportTableToExcel(headers, rows, `Weekly_Make_Donations_Report_${summary.from}_to_${summary.to}`);
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (activeTab === 'donate') {
      const headers = ['#', 'Date', 'User', 'Amount', 'Status'];
      const rows = depositData.map((d, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(d.date).toLocaleDateString(),
        d.username,
        `$${d.amount.toFixed(2)}`,
        d.status,
      ]);
      exportTableToPDF(`Weekly Donate Report (${summary.formattedLabel})`, headers, rows, 'Weekly_Donate_Report');
    } else if (activeTab === 'credits') {
      const headers = ['#', 'Date', 'User', 'Amount', 'Transaction ID'];
      const rows = creditData.map((c, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(c.date).toLocaleDateString(),
        c.username,
        `$${c.amount.toFixed(2)}`,
        c.trans_id,
      ]);
      exportTableToPDF(`Weekly Credit Purchases (${summary.formattedLabel})`, headers, rows, 'Weekly_Credit_Purchases');
    } else {
      const headers = ['#', 'Date', 'Sender', 'Receiver', 'Amount', 'Status'];
      const rows = matchData.map((m, i) => [
        (currentPage - 1) * parseInt(rowsPerPage) + i + 1,
        new Date(m.date).toLocaleDateString(),
        m.sender_username,
        m.receiver_username,
        `$${m.amount.toFixed(2)}`,
        m.status,
      ]);
      exportTableToPDF(`Weekly Make Donations (${summary.formattedLabel})`, headers, rows, 'Weekly_Make_Donations');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── 1. HEADER & WEEK NAVIGATION ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Calendar className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Weekly Donate &amp; Sales Report
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Audited weekly volume ledger across deposits, credit purchases, and peer-to-peer donations
                </p>
              </div>
            </div>
          </div>

          {/* Selected Week Badge & Fast Week Changers */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => shiftWeek(-7)}
              title="Previous Week"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Selected Week:&nbsp;</span>
              <strong className="text-blue-900 font-bold">
                {summary.formattedLabel || 'Current Week'}
              </strong>
            </div>

            <button
              onClick={() => shiftWeek(7)}
              title="Next Week"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition ml-1"
            >
              Current Week
            </button>
          </div>
        </div>

        {/* ── FILTER FORM ── */}
        <form onSubmit={handleSearchSubmit} className="mt-5 pt-5 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User ID */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                User ID / Username
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* From Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                From Date (Monday)
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                To Date (Sunday)
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Actions */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">&nbsp;</label>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition"
                  style={{ backgroundColor: '#FF7A1A' }}
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* ── 3 SUMMARY STATS CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Total Donate */}
          <div
            onClick={() => handleTabChange('donate')}
            className={`cursor-pointer rounded-2xl p-5 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${
              activeTab === 'donate' ? 'ring-4 ring-emerald-400/40' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                Total Donate
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <ArrowDownCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">
              ${summary.deposits.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              <span className="text-xs font-normal text-emerald-100">USDT</span>
            </div>
            <div className="text-xs text-emerald-100/90 font-medium mt-1">
              {summary.deposits.count} Transaction(s)
            </div>
          </div>

          {/* Card 2: Total Credit Purchases */}
          <div
            onClick={() => handleTabChange('credits')}
            className={`cursor-pointer rounded-2xl p-5 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${
              activeTab === 'credits' ? 'ring-4 ring-sky-400/40' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-100">
                Total Credit Purchases
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">
              ${summary.creditPurchases.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              <span className="text-xs font-normal text-sky-100">USDT</span>
            </div>
            <div className="text-xs text-sky-100/90 font-medium mt-1">
              {summary.creditPurchases.count} Transaction(s)
            </div>
          </div>

          {/* Card 3: Total Make Donations */}
          <div
            onClick={() => handleTabChange('matches')}
            className={`cursor-pointer rounded-2xl p-5 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 ${
              activeTab === 'matches' ? 'ring-4 ring-amber-400/40' : ''
            }`}
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-100">
                Total Make Donations
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">
              ${summary.makeDonations.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
              <span className="text-xs font-normal text-amber-100">USDT</span>
            </div>
            <div className="text-xs text-amber-100/90 font-medium mt-1">
              {summary.makeDonations.count} Transaction(s)
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TABBED REPORT TABLES ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Tab Navigation Bar */}
        <div className="border-b border-slate-200 px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
            {/* Tab 1 */}
            <button
              onClick={() => handleTabChange('donate')}
              className={`inline-flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-xs font-bold transition border-b-2 ${
                activeTab === 'donate'
                  ? 'border-emerald-600 text-emerald-700 bg-transparent'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
              <span>Donate History</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                {summary.deposits.count}
              </span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => handleTabChange('credits')}
              className={`inline-flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-xs font-bold transition border-b-2 ${
                activeTab === 'credits'
                  ? 'border-blue-600 text-blue-700 bg-transparent'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>Credit Purchases</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                {summary.creditPurchases.count}
              </span>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => handleTabChange('matches')}
              className={`inline-flex items-center gap-2 pb-3.5 px-3 sm:px-4 text-xs font-bold transition border-b-2 ${
                activeTab === 'matches'
                  ? 'border-amber-600 text-amber-700 bg-transparent'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>Make Donations</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                {summary.makeDonations.count}
              </span>
            </button>
          </div>

          {/* Export Toolbar */}
          <div className="flex items-center gap-2 pb-3">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200/60"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200/60"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>

            {/* Rows Per Page */}
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
              <p className="text-xs text-slate-500 font-semibold">Loading weekly records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* ── TAB 1: DONATE HISTORY ── */}
              {activeTab === 'donate' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-3 font-bold w-12 text-center">#</th>
                      <th className="py-3 px-3 font-bold">Date &amp; Time</th>
                      <th className="py-3 px-3 font-bold">User ID</th>
                      <th className="py-3 px-3 font-bold">Amount (USDT)</th>
                      <th className="py-3 px-3 font-bold">Transaction Hash</th>
                      <th className="py-3 px-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {depositData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <ArrowDownCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No Donate records found for this period.
                        </td>
                      </tr>
                    ) : (
                      depositData.map((d, index) => (
                        <tr key={d.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 text-center text-slate-400 font-medium">
                            {(currentPage - 1) * parseInt(rowsPerPage) + index + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">
                            {new Date(d.date).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{d.username}</div>
                            {d.fullname && d.fullname !== '-' && (
                              <div className="text-[11px] text-slate-400">{d.fullname}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-black text-emerald-600">
                            ${d.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            {d.transaction_hash ? (
                              <a
                                href={`https://bscscan.com/tx/${d.transaction_hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:text-blue-800 hover:underline"
                                title={d.transaction_hash}
                              >
                                {d.transaction_hash.slice(0, 8)}...{d.transaction_hash.slice(-6)}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* ── TAB 2: CREDIT PURCHASES ── */}
              {activeTab === 'credits' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-3 font-bold w-12 text-center">#</th>
                      <th className="py-3 px-3 font-bold">Date &amp; Time</th>
                      <th className="py-3 px-3 font-bold">User ID</th>
                      <th className="py-3 px-3 font-bold">Amount (USDT)</th>
                      <th className="py-3 px-3 font-bold">Transaction ID</th>
                      <th className="py-3 px-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {creditData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No credit purchases found for this period.
                        </td>
                      </tr>
                    ) : (
                      creditData.map((c, index) => (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 text-center text-slate-400 font-medium">
                            {(currentPage - 1) * parseInt(rowsPerPage) + index + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">
                            {new Date(c.date).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{c.username}</div>
                            {c.fullname && c.fullname !== '-' && (
                              <div className="text-[11px] text-slate-400">{c.fullname}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-black text-blue-600">
                            ${c.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                            {c.trans_id || '—'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* ── TAB 3: MAKE DONATIONS ── */}
              {activeTab === 'matches' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-3 font-bold w-12 text-center">#</th>
                      <th className="py-3 px-3 font-bold">Date &amp; Time</th>
                      <th className="py-3 px-3 font-bold">User ID (Sender)</th>
                      <th className="py-3 px-3 font-bold">Donation Amount (USDT)</th>
                      <th className="py-3 px-3 font-bold">Receiver ID</th>
                      <th className="py-3 px-3 font-bold">Transaction ID</th>
                      <th className="py-3 px-3 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matchData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No donations found for this period.
                        </td>
                      </tr>
                    ) : (
                      matchData.map((m, index) => (
                        <tr key={m.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 text-center text-slate-400 font-medium">
                            {(currentPage - 1) * parseInt(rowsPerPage) + index + 1}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">
                            {new Date(m.date).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{m.sender_username}</div>
                            {m.sender_fullname && m.sender_fullname !== '-' && (
                              <div className="text-[11px] text-slate-400">{m.sender_fullname}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-black text-amber-600">
                            ${m.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">{m.receiver_username}</div>
                            {m.receiver_fullname && m.receiver_fullname !== '-' && (
                              <div className="text-[11px] text-slate-400">{m.receiver_fullname}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                            {m.reference_no || '—'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {m.status === 'completed' || m.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {m.status === 'completed' ? 'Completed' : 'Confirmed'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                <Clock className="w-3 h-3 text-amber-600" />
                                {m.status || 'Pending'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── PAGINATION CONTROLS ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Showing Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong> (
              <strong className="text-slate-800">{totalCount}</strong> total entries)
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl border border-slate-200">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportPage;
