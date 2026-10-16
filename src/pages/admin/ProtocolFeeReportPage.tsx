import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  Copy,
  Check,
  Calendar,
  Layers,
  Coins,
  X,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import adminReportService, {
  type ProtocolFeeReportItem,
} from '../../services/adminReportService';

export const ProtocolFeeReportPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ProtocolFeeReportItem[]>([]);
  const [metrics, setMetrics] = useState({
    total_fees: 0,
    total_operations: 0,
    total_donations: 0,
    protocol_rate: '1.0%',
  });

  // Filter & Pagination States
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<string>('25');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch report data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminReportService.getProtocolFee({
        search: debouncedSearch || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: currentPage,
        limit: parseInt(rowsPerPage, 10) || 25,
      });

      if (res.success && res.data) {
        setData(res.data);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
        if (res.meta) {
          setTotalCount(res.meta.total);
          setTotalPages(res.meta.totalPages);
        }
      }
    } catch (err) {
      console.error('[ProtocolFeeReportPage Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, startDate, endDate, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search || startDate || endDate);

  // Export handlers
  const handleExportExcel = () => {
    const headers = ['#', 'Transaction ID', 'Donor Member', 'Donor Name', 'Donor Email', 'Package', 'Donation Amount', 'Rate', 'Protocol Fee', 'Company Balance', 'Remarks', 'Date'];
    const rows = data.map((d, i) => [
      i + 1,
      d.trans_id,
      d.donor_username,
      d.donor_fullname,
      d.donor_email,
      d.package_name,
      `$${d.donation_amount.toFixed(2)}`,
      d.rate,
      `$${d.fee_amount.toFixed(2)}`,
      `$${d.new_balance.toFixed(2)}`,
      d.description,
      new Date(d.date).toLocaleString(),
    ]);
    exportTableToExcel(headers, rows, 'Protocol_Fee_8th_Level_Report');
  };

  const handleExportPDF = () => {
    const headers = ['#', 'Trans ID', 'Donor', 'Package', 'Rate', 'Fee Amount', 'Balance', 'Date'];
    const rows = data.map((d, i) => [
      i + 1,
      d.trans_id,
      d.donor_username,
      d.package_name,
      d.rate,
      `$${d.fee_amount.toFixed(2)}`,
      `$${d.new_balance.toFixed(2)}`,
      new Date(d.date).toLocaleDateString(),
    ]);
    exportTableToPDF('1% Protocol Fee (8th Level) - Master Company Ledger', headers, rows, 'Protocol_Fee_Report');
  };

  // Date formatting helpers
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return diffHours <= 1 ? 'Just now' : `${diffHours}h ago`;
      }
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </span>
              1% Protocol Fee (8th Level)
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Top Company ID #1 Exclusive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated 1% protocol fee deductions collected on community donations and routed to company master reserve.
          </p>
        </div>

        {/* Export & Refresh Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition disabled:opacity-50"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ffa800]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer transition active:scale-95"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm cursor-pointer transition active:scale-95"
            title="Export to PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Protocol Fees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                Total Protocol Fees
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                +${metrics.total_fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Directly routed to company master account
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Fee Operations Logged */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-slate-400 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 to-slate-900"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                Fee Operations Logged
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {metrics.total_operations.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Ops</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Triggered upon verified donations
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Community Donation Volume */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                Donations Volume
              </span>
              <div className="text-2xl font-black text-sky-600 mt-1">
                ${metrics.total_donations.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total community volume supporting protocol
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 4: Protocol Split Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-[#ffa800]"></div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block">
                Protocol Split Rate
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {metrics.protocol_rate} <span className="text-sm font-semibold text-slate-500">Fixed</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                8th Level automated protocol deduction
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
              <Percent className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Protocol Fee Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalCount.toLocaleString()} Records
            </span>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Live Search */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Trx ID, Donor, Email..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:border-[#ffa800] focus:ring-1 focus:ring-[#ffa800] outline-none transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Range Start */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-transparent outline-none cursor-pointer"
                title="Start Date"
              />
            </div>

            {/* Date Range End */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-transparent outline-none cursor-pointer"
                title="End Date"
              />
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition text-xs font-semibold cursor-pointer flex items-center gap-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. The Data Table */}
        <div className="overflow-x-auto">
          <table id="protocol-fee-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">From Donor</th>
                <th className="py-3.5 px-4">Package / Donation</th>
                <th className="py-3.5 px-4 text-center">Rate</th>
                <th className="py-3.5 px-4 text-right">Protocol Fee</th>
                <th className="py-3.5 px-4 text-right">Company Balance</th>
                <th className="py-3.5 px-4">Remarks / Description</th>
                <th className="py-3.5 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="h-4 w-6 bg-slate-200 rounded mx-auto"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-8 w-36 bg-slate-200 rounded-xl"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-5 w-12 bg-slate-200 rounded-full mx-auto"></div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-16 bg-slate-200 rounded ml-auto"></div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-16 bg-slate-200 rounded ml-auto"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-40 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-24 bg-slate-200 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={9} className="py-16 px-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <ShieldCheck className="w-8 h-8 opacity-60" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No Protocol Fee Records Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {hasActiveFilters
                        ? 'No transactions matched your current search filters. Try clearing filters to see all records.'
                        : 'Protocol fees are automatically recorded when community donations are activated.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#ffa800] text-slate-950 hover:bg-[#ff9800] transition cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                // Table Rows
                data.map((row, index) => {
                  const serialNo = (currentPage - 1) * (parseInt(rowsPerPage, 10) || 25) + index + 1;
                  const isCopied = copiedId === row.trans_id;
                  const initial = (row.donor_username || 'D').charAt(0).toUpperCase();

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* # Serial */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-400">
                        {serialNo}
                      </td>

                      {/* Transaction ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                            #{row.trans_id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(row.trans_id, row.trans_id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
                            title="Copy Transaction ID"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* From Donor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{row.donor_username}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {row.donor_fullname}
                            </div>
                            {row.donor_email && row.donor_email !== '-' && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {row.donor_email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Package / Donation Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          ${row.donation_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {row.package_name}
                        </span>
                      </td>

                      {/* Rate */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          1.0%
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">8th Level</span>
                      </td>

                      {/* Protocol Fee Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-emerald-600 text-sm">
                          +${row.fee_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Company Balance */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                        ${row.new_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Remarks / Description */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="text-slate-800 font-medium truncate" title={row.description}>
                          {row.description}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate" title={row.remarks}>
                          {row.remarks}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-semibold text-slate-700">{formatDate(row.date)}</div>
                        <div className="text-[10px] text-slate-400">{formatRelativeTime(row.date)}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Toolbar */}
        {!loading && totalCount > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * (parseInt(rowsPerPage, 10) || 25) + 1} to{' '}
              {Math.min(currentPage * (parseInt(rowsPerPage, 10) || 25), totalCount)} of {totalCount.toLocaleString()}{' '}
              records
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {/* Page indicator pills */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  if (pageNum < 1) pageNum = 1;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#ffa800] text-slate-950 shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolFeeReportPage;
