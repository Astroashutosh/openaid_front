import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import adminPurchaseDonationService, {
  type CreditPurchaseItem,
  type DonationItem,
  type PurchaseDonationSummary,
} from '../../services/adminPurchaseDonationService';

interface PurchaseDonationPageProps {
  type?: 'credit-purchases' | 'donations';
}

export const PurchaseDonationPage: React.FC<PurchaseDonationPageProps> = ({ type: propType }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from pathname or prop
  const getTabFromPath = (): 'credit-purchases' | 'donations' => {
    if (location.pathname.includes('/credit-purchases')) return 'credit-purchases';
    if (location.pathname.includes('/donations')) return 'donations';
    return propType || 'credit-purchases';
  };

  const [activeTab, setActiveTab] = useState<'credit-purchases' | 'donations'>(getTabFromPath());
  const [loading, setLoading] = useState(false);

  // Summary Metrics
  const [summary, setSummary] = useState<PurchaseDonationSummary>({
    creditPurchases: { count: 0, amount: 0 },
    donations: { count: 0, amount: 0 },
  });

  // Table Data & Filters
  const [creditData, setCreditData] = useState<CreditPurchaseItem[]>([]);
  const [donationData, setDonationData] = useState<DonationItem[]>([]);
  const [filteredTotalAmount, setFilteredTotalAmount] = useState<number>(0);
  const [searchUname, setSearchUname] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
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
        const res = await adminPurchaseDonationService.getSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load summary stats:', err);
      }
    };
    fetchSummary();
  }, []);

  // Fetch tab records
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const limit = parseInt(rowsPerPage) || 10;
      if (activeTab === 'credit-purchases') {
        const res = await adminPurchaseDonationService.getCreditPurchases({
          uname: activeSearch,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setCreditData(res.data);
          setFilteredTotalAmount(res.total_amount || 0);
          setTotalCount(res.meta?.total || 0);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } else {
        const res = await adminPurchaseDonationService.getDonations({
          uname: activeSearch,
          page: currentPage,
          limit,
        });
        if (res.success) {
          setDonationData(res.data);
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
  }, [activeTab, activeSearch, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchUname.trim());
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchUname('');
    setActiveSearch('');
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (activeTab === 'credit-purchases') {
      const headers = ['Transaction Id', 'User Id', 'User Name', 'Email', 'Payment Method', 'Amount', 'Date'];
      const rows = creditData.map((item) => [
        item.trans_id,
        item.username,
        item.fullname,
        item.email,
        item.payment_method,
        `$${item.amount.toFixed(2)}`,
        new Date(item.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'Credit_Purchases_Report');
    } else {
      const headers = ['Transaction Id', 'User Id', 'User Name', 'Email', 'Donation Type', 'Amount', 'Date'];
      const rows = donationData.map((item) => [
        item.trans_id,
        item.username,
        item.fullname,
        item.email,
        item.donation_type,
        `$${item.amount.toFixed(2)}`,
        new Date(item.date).toLocaleString(),
      ]);
      exportTableToExcel(headers, rows, 'Make_Donation_Report');
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (activeTab === 'credit-purchases') {
      const headers = ['Trans Id', 'User Id', 'User Name', 'Method', 'Amount', 'Date'];
      const rows = creditData.map((item) => [
        item.trans_id,
        item.username,
        item.fullname,
        item.payment_method,
        `$${item.amount.toFixed(2)}`,
        new Date(item.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Credit Purchases Ledger', headers, rows, 'Credit_Purchases_Report');
    } else {
      const headers = ['Trans Id', 'User Id', 'User Name', 'Type', 'Amount', 'Date'];
      const rows = donationData.map((item) => [
        item.trans_id,
        item.username,
        item.fullname,
        item.donation_type,
        `$${item.amount.toFixed(2)}`,
        new Date(item.date).toLocaleDateString(),
      ]);
      exportTableToPDF('Make Donation Ledger', headers, rows, 'Make_Donation_Report');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Credit Purchases Overall */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Credit Purchases
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ${summary.creditPurchases.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {summary.creditPurchases.count} Total E-Pin Orders
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>$10/Credit E-Pin Purchases</span>
          </div>
        </div>

        {/* Card 2: Donations Overall */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Donations Processed
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                ${summary.donations.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {summary.donations.count} Total Contribution Entries
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Deposit, Recommit & Income Wallets</span>
          </div>
        </div>

        {/* Card 3: Filtered Total Amount (Matching Laravel lines 75-87) */}
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
              Across {totalCount} matching {activeTab === 'credit-purchases' ? 'credit purchase' : 'donation'} records
            </p>
          </div>
          <div className="mt-4 pt-2 text-[10px] text-slate-400 border-t border-white/10 flex items-center justify-between">
            <span>Current Filter: {activeSearch ? `"${activeSearch}"` : 'All Members'}</span>
            <span className="capitalize">{activeTab === 'credit-purchases' ? 'Credit Purchase' : 'Make Donation'}</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER & TAB NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            {activeTab === 'credit-purchases' ? 'Credit Purchase Report' : 'Make Donation Report'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin / Purchase & Donation • Transaction records, member accounts, and payment channels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate('/admin/purchase-donation/credit-purchases')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'credit-purchases'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Credit Purchase</span>
              <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.creditPurchases.count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/purchase-donation/donations')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'donations'
                  ? 'bg-[#172b4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Make Donation</span>
              <span className="bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
                {summary.donations.count}
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

      {/* 3. SEARCH & ROW FILTER BAR (Exact match to lines 18-68 in epin_purchase.blade.php) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Username / Email / Trans ID</label>
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

          <div className="md:col-span-4 flex items-center gap-2">
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

      {/* 4. MAIN DATA TABLE (Matching epin_purchase.blade.php lines 98-125) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            {activeTab === 'credit-purchases' ? 'Credit Purchase Ledger' : 'Make Donation Ledger'}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Total {totalCount} Records {activeSearch ? `(Filtered by "${activeSearch}")` : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'credit-purchases' ? (
            /* Credit Purchases Table */
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                      <span className="font-semibold text-xs">Loading credit purchase records...</span>
                    </td>
                  </tr>
                ) : creditData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-500" />
                      <p className="font-bold text-sm text-slate-700">No credit purchases found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No purchase records exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  creditData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      {/* Transaction Id */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {row.trans_id}
                      </td>

                      {/* User Id (Username) */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>

                      {/* User Name (Full Name) */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{row.fullname}</div>
                        {row.email && row.email !== '-' && (
                          <div className="text-[11px] text-slate-400">{row.email}</div>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                          {row.payment_method}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">
                        ${row.amount.toFixed(2)}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(row.date).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* Make Donation Table */
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">User Id</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Donation Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                      <span className="font-semibold text-xs">Loading donation records...</span>
                    </td>
                  </tr>
                ) : donationData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-500" />
                      <p className="font-bold text-sm text-slate-700">No donation records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeSearch ? `No records matched query "${activeSearch}"` : 'No donation transactions exist in the database.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  donationData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      {/* Transaction Id */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {row.trans_id}
                      </td>

                      {/* User Id (Username) */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">
                          {row.username}
                        </span>
                      </td>

                      {/* User Name (Full Name) */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{row.fullname}</div>
                        {row.email && row.email !== '-' && (
                          <div className="text-[11px] text-slate-400">{row.email}</div>
                        )}
                      </td>

                      {/* Donation Method */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {row.donation_type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                        ${row.amount.toFixed(2)}
                      </td>

                      {/* Date */}
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

export default PurchaseDonationPage;
