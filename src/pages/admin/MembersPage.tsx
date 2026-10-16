import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  FileText,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User as UserIcon,
  Edit,
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../../utils/exportUtils';
import { adminMemberService } from '../../services/adminMemberService';
import type {
  AdminMemberItem,
  MemberCounts,
  MemberCountry,
  MemberPagination,
} from '../../services/adminMemberService';

export const MembersPage: React.FC = () => {
  const location = useLocation();

  // Determine active category from route matching Laravel blade views:
  // - /admin/members or /admin/members/active -> 'active' (index.blade.php)
  // - /admin/members/inactive or /admin/inactive-members -> 'inactive' (inactive_users.blade.php)
  // - /admin/members/blocked or /admin/blocked-members -> 'blocked' (blocked_members.blade.php)
  // - /admin/members/suspended or /admin/ban-members -> 'suspended' (ban_users.blade.php)
  const currentCategory = useMemo<'active' | 'inactive' | 'blocked' | 'suspended'>(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/inactive')) return 'inactive';
    if (path.includes('/blocked')) return 'blocked';
    if (path.includes('/suspended') || path.includes('/ban-members')) return 'suspended';
    return 'active';
  }, [location.pathname]);

  // Page title and headers matching Laravel blade files
  const pageMeta = useMemo(() => {
    switch (currentCategory) {
      case 'inactive':
        return {
          title: 'Inactive Members',
          boxTitle: 'Inactive Members',
          activeTab: 'inactive',
        };
      case 'blocked':
        return {
          title: 'Blocked Members',
          boxTitle: 'Blocked Members',
          activeTab: 'blocked',
        };
      case 'suspended':
        return {
          title: 'Banned Members',
          boxTitle: 'Banned Members',
          activeTab: 'suspended',
        };
      default:
        return {
          title: 'Active Members',
          boxTitle: 'Members',
          activeTab: 'active',
        };
    }
  }, [currentCategory]);

  // Data states
  const [members, setMembers] = useState<AdminMemberItem[]>([]);
  const [countries, setCountries] = useState<MemberCountry[]>([]);
  const [counts, setCounts] = useState<MemberCounts>({
    all: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    suspended: 0,
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [pagination, setPagination] = useState<MemberPagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  // Filter form states matching Laravel searchform
  const [unameSearch, setUnameSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [appliedCountry, setAppliedCountry] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [changePasswordUser, setChangePasswordUser] = useState<AdminMemberItem | null>(null);
  const [passwordType, setPasswordType] = useState<'password' | 'transaction_password'>('password');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);


  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch countries once for the filter dropdown
  useEffect(() => {
    let isMounted = true;
    adminMemberService
      .getCountries()
      .then((data) => {
        if (isMounted) setCountries(data);
      })
      .catch((err) => console.error('Failed to load countries:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch members from backend API
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminMemberService.getMembers({
        type: currentCategory,
        page,
        limit,
        search: appliedSearch,
        country: appliedCountry,
      });
      setMembers(res.data);
      setCounts(res.counts);
      setPagination(res.pagination);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch members data', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentCategory, page, limit, appliedSearch, appliedCountry]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Reset pagination and search when navigating to a different member category
  useEffect(() => {
    setPage(1);
    setUnameSearch('');
    setAppliedSearch('');
    setSelectedCountry('');
    setAppliedCountry('');
  }, [location.pathname]);

  // Handle Search Form Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(unameSearch.trim());
    setAppliedCountry(selectedCountry);
    setPage(1);
  };

  // Handle Filter Reset
  const handleResetFilters = () => {
    setUnameSearch('');
    setAppliedSearch('');
    setSelectedCountry('');
    setAppliedCountry('');
    setPage(1);
  };

  // Date formatter
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '--';
    try {
      const d = new Date(dateStr);
      return d.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      return dateStr;
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const headers = [
      'Sr. No.',
      'User Id',
      'Name',
      'Email',
      'Phone No.',
      'Sponsor Id',
      'Sponsor Name',
      'Rank Name',
      'Status',
      'Register Date',
      'Country',
    ];

    const rows = members.map((m, idx) => [
      (page - 1) * limit + idx + 1,
      m.username,
      m.name,
      m.email,
      m.phone,
      m.sponsorId,
      m.sponsorName,
      m.rankName,
      m.isBlocked ? 'Blocked' : m.isSuspended ? 'Suspended' : m.status,
      formatDate(m.registerDate),
      m.country,
    ]);

    exportTableToExcel(headers, rows, `${pageMeta.title.replace(/\s+/g, '_')}_List`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const headers = [
      '#',
      'User Id',
      'Name',
      'Email',
      'Phone No.',
      'Sponsor Id',
      'Sponsor Name',
      'Rank',
      'Status',
      'Register Date',
    ];

    const rows = members.map((m, idx) => [
      (page - 1) * limit + idx + 1,
      m.username,
      m.name,
      m.email,
      m.phone,
      m.sponsorId,
      m.sponsorName,
      m.rankName,
      m.isBlocked ? 'Blocked' : m.isSuspended ? 'Suspended' : m.status,
      formatDate(m.registerDate),
    ]);

    exportTableToPDF(`${pageMeta.title} Directory Report`, headers, rows, `${pageMeta.title.replace(/\s+/g, '_')}_Directory`);
  };

  // Status Action: Block / Unblock (Matching updateU / updateUt in Laravel)
  const handleToggleBlock = async (user: AdminMemberItem) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    const confirmPrompt = user.isBlocked
      ? `Would you like to unblock this account (${user.username})?`
      : `Would you like to block this account (${user.username})?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await adminMemberService.updateStatus({ id: user.id, action });
      showToast(res.message);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Unable to update account block status', 'error');
    }
  };

  // Status Action: Suspend / Unsuspend
  const handleToggleSuspend = async (user: AdminMemberItem) => {
    const action = user.isSuspended ? 'unsuspend' : 'suspend';
    const confirmPrompt = user.isSuspended
      ? `Would you like to unsuspend this account (${user.username})?`
      : `Would you like to suspend this account (${user.username})?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await adminMemberService.updateStatus({ id: user.id, action });
      showToast(res.message);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Unable to update account suspend status', 'error');
    }
  };

  // Impersonate Member (Login as User)
  const handleImpersonate = async (user: AdminMemberItem) => {
    if (
      !window.confirm(
        `Are you sure you want to log in as user ${user.username} (${user.name})?\n\nAdmin session will be paused and the user portal will open in this window.`
      )
    ) {
      return;
    }
    try {
      const res = await adminMemberService.impersonate(user.id);
      if (res.token) {
        const adminToken = localStorage.getItem('admin_token');
        const adminUser = localStorage.getItem('admin_user');

        // Store impersonation snapshot
        if (adminToken) localStorage.setItem('impersonate_admin_token', adminToken);
        if (adminUser) localStorage.setItem('impersonate_admin_user', adminUser);
        localStorage.setItem(
          'impersonate_admin_return_url',
          window.location.pathname + window.location.search
        );

        // Destroy / clear admin active session
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_login_time');

        // Set active user session
        localStorage.setItem('user_token', res.token);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('user_login_time', Date.now().toString());

        // Redirect same window to user dashboard
        window.location.href = '/user/dashboard';
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to login as user', 'error');
    }
  };

  // Handle Save Password (Matching updatePassForm in Laravel)
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordUser) return;
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setSubmittingPassword(true);
    try {
      const res = await adminMemberService.updatePassword({
        user_id: changePasswordUser.id,
        password_type: passwordType,
        new_password: newPassword.trim(),
      });
      showToast(res.message);
      setChangePasswordUser(null);
      setNewPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setSubmittingPassword(false);
    }
  };

  // Render pagination controls
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

  // Current category count display
  const currentCount =
    currentCategory === 'inactive'
      ? counts.inactive
      : currentCategory === 'blocked'
      ? counts.blocked
      : currentCategory === 'suspended'
      ? counts.suspended
      : counts.active;

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
          <h4 className="text-lg font-bold text-slate-800">{pageMeta.title}</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
            <Link to="/admin" className="hover:text-slate-800 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Members List</span>
          </div>
        </div>
      </div>

      {/* Card Box (Matching Laravel box structure) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Box Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {pageMeta.boxTitle} ({currentCount})
            </h3>
            <p className="text-[11px] text-slate-500 mb-0">
              Complete audit and records of {currentCategory} protocol accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchMembers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            title="Refresh table"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Search Form Filter (Exact match for Laravel searchform) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            {/* By name, email, phone */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                By name, email, phone
              </label>
              <input
                type="text"
                value={unameSearch}
                onChange={(e) => setUnameSearch(e.target.value)}
                placeholder="Search by username, email, phone no ..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
              />
            </div>

            {/* Country */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0c2c23]"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search and Reset Buttons */}
            <div className="sm:col-span-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-3 py-1.5 bg-[#0c2c23] hover:bg-[#0c2c23]/90 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
              </button>
              {(appliedSearch || appliedCountry) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition"
                  title="Reset filters"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Controls (Show entries, Excel, PDF) */}
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
              title="Export pure table data to Excel (.csv)"
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

        {/* Table (Columns exact match with Laravel index.blade.php) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Sr. No.</th>
                <th className="py-2.5 px-3 w-12 text-center">Image</th>
                <th className="py-2.5 px-3">User Id</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Phone No.</th>
                <th className="py-2.5 px-3">Sponsor Id</th>
                <th className="py-2.5 px-3">Sponsor Name</th>
                <th className="py-2.5 px-3">Rank Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Register Date</th>
                <th className="py-2.5 px-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0c2c23]" />
                      <span>Loading member records...</span>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center text-slate-500 py-8">
                    No {currentCategory} members found matching criteria.
                  </td>
                </tr>
              ) : (
                members.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                      {(page - 1) * limit + idx + 1}
                    </td>

                    {/* Image Avatar */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 text-[11px] overflow-hidden mx-auto shadow-2xs">
                        {row.image && row.image !== 'default.png' ? (
                          <img
                            src={`/uploads/user/${row.image}`}
                            alt={row.username}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>{row.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </td>

                    {/* User ID */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {row.username}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {row.name}
                    </td>

                    {/* Email */}
                    <td className="py-2.5 px-3 text-slate-600">{row.email}</td>

                    {/* Phone */}
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.phone}</td>

                    {/* Sponsor ID */}
                    <td className="py-2.5 px-3 font-mono text-slate-700">{row.sponsorId}</td>

                    {/* Sponsor Name */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{row.sponsorName}</td>

                    {/* Rank Name */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {row.rankName}
                      </span>
                    </td>

                    {/* Status Badge (Exact match with Laravel blade) */}
                    <td className="py-2.5 px-3 whitespace-nowrap space-y-1">
                      <div>
                        {row.status === 'Active' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      {row.isBlocked && (
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                            Blocked
                          </span>
                        </div>
                      )}
                      {row.isSuspended && (
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                            Suspended
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Register Date */}
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDate(row.registerDate)}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="py-2.5 px-3 text-center relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenuId(activeActionMenuId === row.id ? null : row.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
                      >
                        <span>Actions</span>
                        <MoreVertical className="w-3 h-3 text-slate-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeActionMenuId === row.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-3 top-9 z-40 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-left text-xs divide-y divide-slate-100 animate-in fade-in"
                        >
                          <div className="py-1">
                            {/* Profile (New Page) */}
                            <Link
                              to={`/admin/profile/${row.id}`}
                              onClick={() => setActiveActionMenuId(null)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                            >
                              <UserIcon className="w-3.5 h-3.5 text-slate-500" /> Profile
                            </Link>

                            {/* Update Profile (New Page - Matching Screenshot 1) */}
                            <Link
                              to={`/admin/update-profile/${row.id}`}
                              onClick={() => setActiveActionMenuId(null)}
                              className="w-full px-3 py-1.5 text-left text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium transition"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-500" /> Update Profile
                            </Link>

                            {/* Change Password */}
                            <button
                              type="button"
                              onClick={() => {
                                setChangePasswordUser(row);
                                setPasswordType('password');
                                setNewPassword('');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-slate-500" /> Change Password
                            </button>
                          </div>

                          <div className="py-1">
                            {/* Block / Unblock Account */}
                            <button
                              type="button"
                              onClick={() => {
                                handleToggleBlock(row);
                                setActiveActionMenuId(null);
                              }}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                                row.isBlocked
                                  ? 'text-emerald-700 hover:bg-emerald-50'
                                  : 'text-rose-700 hover:bg-rose-50'
                              }`}
                            >
                              {row.isBlocked ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Unblock Account
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Block Account
                                </>
                              )}
                            </button>

                            {/* Suspend / Unsuspend Account */}
                            <button
                              type="button"
                              onClick={() => {
                                handleToggleSuspend(row);
                                setActiveActionMenuId(null);
                              }}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-2 font-medium ${
                                row.isSuspended
                                  ? 'text-emerald-700 hover:bg-emerald-50'
                                  : 'text-amber-800 hover:bg-amber-50'
                              }`}
                            >
                              {row.isSuspended ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Unsuspend Account
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Suspend Account
                                </>
                              )}
                            </button>
                          </div>

                          <div className="py-1">
                            {/* Login as User */}
                            <button
                              type="button"
                              onClick={() => {
                                handleImpersonate(row);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#0c2c23] hover:bg-emerald-50 flex items-center gap-2 font-bold"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-700" /> Login as User
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {renderPagination()}
      </div>

      {/* ========================================================================= */}
      {/* UPDATE PASSWORD MODAL (Exact match for update_pass_model in Laravel) */}
      {/* ========================================================================= */}
      {changePasswordUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">Update Password</h4>
              <button
                type="button"
                onClick={() => setChangePasswordUser(null)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePassword} className="p-4 space-y-3.5">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500">Member: </span>
                <strong className="text-slate-900 font-bold">{changePasswordUser.name}</strong>
                <span className="font-mono text-slate-600 ml-1">({changePasswordUser.username})</span>
              </div>

              {/* Password Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Password Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={passwordType}
                  onChange={(e) => setPasswordType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23] bg-white"
                >
                  <option value="password">Login Password</option>
                  <option value="transaction_password">Transaction Password</option>
                </select>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pr-9 pl-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2c23]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <small className="text-slate-400 block text-[10px] mt-0.5">
                  Must be at least 6 characters long.
                </small>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setChangePasswordUser(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
    </div>
  );
};
