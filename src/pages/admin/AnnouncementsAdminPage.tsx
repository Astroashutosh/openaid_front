import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Send,
  Eye,
  Trash2,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
  UserCheck,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Bell,
  Check,
} from 'lucide-react';
import {
  adminAnnouncementService,
  type AnnouncementItem,
  type AnnouncementDetails,
  type EligibleUser,
} from '../../services/adminAnnouncementService';

interface AnnouncementsAdminPageProps {
  mode?: 'list' | 'create';
}

export const AnnouncementsAdminPage: React.FC<AnnouncementsAdminPageProps> = ({ mode: propMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active view mode
  const isCreateRoute =
    propMode === 'create' ||
    location.pathname.includes('/create') ||
    location.pathname.includes('/send');

  const [viewMode, setViewMode] = useState<'list' | 'create'>(isCreateRoute ? 'create' : 'list');

  // Synchronize with URL
  useEffect(() => {
    setViewMode(isCreateRoute ? 'create' : 'list');
  }, [isCreateRoute]);

  // List View State
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [flashMsg, setFlashMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Pagination for List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Details Modal State
  const [selectedDetails, setSelectedDetails] = useState<AnnouncementDetails | null>(null);
  const [detailsSearch, setDetailsSearch] = useState<string>('');

  // Delete Confirmation Modal State
  const [announcementToDelete, setAnnouncementToDelete] = useState<AnnouncementItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Compose / Send Form State (matching send.blade.php)
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    recipient_type: 'all' | 'selected';
    recipients: number[];
  }>({
    title: '',
    description: '',
    recipient_type: 'all',
    recipients: [],
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<EligibleUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');

  // Auto-dismiss flash message after 5 seconds
  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => {
        setFlashMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  // Fetch announcements list
  const fetchAnnouncements = async () => {
    try {
      setLoadingList(true);
      const data = await adminAnnouncementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      console.error('[fetchAnnouncements Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Failed to load announcements.',
      });
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch users list for recipient picker
  const fetchEligibleUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await adminAnnouncementService.getEligibleUsers();
      setUsersList(data);
    } catch (err: any) {
      console.error('[fetchEligibleUsers Error]', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchEligibleUsers();
  }, []);

  // Format date helper matching d-m-Y H:i
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return '-';
    }
  };

  // Open Details Modal
  const handleOpenDetails = async (item: AnnouncementItem) => {
    try {
      setDetailsSearch('');
      const data = await adminAnnouncementService.getAnnouncementDetails(item.title);
      setSelectedDetails(data);
    } catch (err: any) {
      console.error('[handleOpenDetails Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Failed to load announcement details.',
      });
    }
  };

  // Delete Announcement Broadcast
  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) return;
    try {
      setDeleting(true);
      const res = await adminAnnouncementService.deleteAnnouncement(announcementToDelete.title);
      setFlashMsg({
        type: 'success',
        text: res.message || 'Announcement broadcast deleted successfully.',
      });
      setAnnouncements((prev) => prev.filter((a) => a.title !== announcementToDelete.title));
      setAnnouncementToDelete(null);
    } catch (err: any) {
      console.error('[handleDeleteConfirm Error]', err);
      setFlashMsg({
        type: 'error',
        text: err?.message || 'Failed to delete announcement broadcast.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered users for Recipient Picker
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersList;
    const q = userSearch.toLowerCase();
    return usersList.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        (u.first_name && u.first_name.toLowerCase().includes(q)) ||
        (u.last_name && u.last_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [usersList, userSearch]);

  // Recipient selection toggle
  const toggleUserSelection = (userId: number) => {
    setFormData((prev) => {
      const exists = prev.recipients.includes(userId);
      const newRecipients = exists
        ? prev.recipients.filter((id) => id !== userId)
        : [...prev.recipients, userId];
      return { ...prev, recipients: newRecipients };
    });
  };

  const handleSelectAllUsers = () => {
    const allFilteredIds = filteredUsers.map((u) => u.id);
    setFormData((prev) => {
      const combined = Array.from(new Set([...prev.recipients, ...allFilteredIds]));
      return { ...prev, recipients: combined };
    });
  };

  const handleClearSelectedUsers = () => {
    setFormData((prev) => ({ ...prev, recipients: [] }));
  };

  // Submit Send Announcement Form
  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const errors: string[] = [];
    if (!formData.title.trim()) {
      errors.push('The announcement title is required.');
    }
    if (!formData.description.trim()) {
      errors.push('The description / message is required.');
    }
    if (formData.recipient_type === 'selected' && formData.recipients.length === 0) {
      errors.push('Please select at least one recipient.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminAnnouncementService.sendAnnouncement({
        title: formData.title.trim(),
        description: formData.description.trim(),
        recipient_type: formData.recipient_type,
        recipients: formData.recipient_type === 'selected' ? formData.recipients : undefined,
      });

      setFlashMsg({
        type: 'success',
        text: res.message || `Announcement sent to ${res.recipient_count} user(s) successfully.`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        recipient_type: 'all',
        recipients: [],
      });
      setUserSearch('');

      await fetchAnnouncements();
      navigate('/admin/announcements');
    } catch (err: any) {
      console.error('[handleSendSubmit Error]', err);
      setFormErrors([err?.message || 'Failed to send announcement. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered & Paginated Announcements
  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }, [announcements, searchQuery]);

  const totalFiltered = filteredAnnouncements.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * perPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + perPage);

  // Filtered recipients inside details modal
  const filteredDetailsRecipients = useMemo(() => {
    if (!selectedDetails) return [];
    if (!detailsSearch.trim()) return selectedDetails.recipients;
    const q = detailsSearch.toLowerCase();
    return selectedDetails.recipients.filter(
      (r) =>
        r.username.toLowerCase().includes(q) ||
        (r.first_name && r.first_name.toLowerCase().includes(q)) ||
        (r.last_name && r.last_name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q))
    );
  }, [selectedDetails, detailsSearch]);

  // ==========================================================================
  // RENDER: CREATE / SEND ANNOUNCEMENT VIEW (Matching send.blade.php)
  // ==========================================================================
  if (viewMode === 'create') {
    return (
      <div className="w-full space-y-6">
        {/* Content Header */}
        <div className="content-header">
          <div className="flex items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">Send Announcements</h4>
              <div className="d-inline-block align-items-center">
                <nav>
                  <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <li className="breadcrumb-item">
                      <Link to="/admin/dashboard" className="hover:text-slate-800 flex items-center">
                        <Home className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/announcements')}
                        className="hover:text-slate-800 text-blue-600 hover:underline"
                      >
                        Announcements
                      </button>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      Send Announcement
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <section className="content">
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                {/* Box Header */}
                <div className="box-header with-border px-6 py-4 border-b border-slate-200">
                  <h4 className="box-title text-base font-bold text-slate-800">Write Announcement</h4>
                  <h6 className="box-subtitle text-xs text-slate-500 mt-1">
                    Sent announcements are <b className="text-slate-700">permanent</b> — once sent, they cannot be edited or deleted by admin.
                  </h6>
                </div>

                {/* Validation Errors Alert matching Laravel @if ($errors->any()) */}
                {formErrors.length > 0 && (
                  <div className="alert alert-danger bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                      {formErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Form matching send.blade.php */}
                <form onSubmit={handleSendSubmit} className="form" id="announcementSendForm">
                  <div className="box-body p-6 space-y-5">
                    {/* Title */}
                    <div className="form-group space-y-1.5">
                      <label className="form-label block text-xs font-semibold text-slate-700">
                        Announcement Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control w-full border border-slate-300 rounded-md px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter announcement title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Description / Message */}
                    <div className="form-group space-y-1.5">
                      <label className="form-label block text-xs font-semibold text-slate-700">
                        Description / Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        className="form-control w-full border border-slate-300 rounded-md p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition leading-relaxed"
                        rows={5}
                        placeholder="Enter announcement message"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        required
                      />
                    </div>

                    {/* Recipients Section */}
                    <div className="form-group space-y-2">
                      <label className="form-label block text-xs font-semibold text-slate-700">
                        Recipients <span className="text-red-500">*</span>
                      </label>

                      {/* Recipient Toggle matching blade .recipient-toggle */}
                      <div className="inline-flex border border-slate-200 rounded-xl bg-slate-50 p-1 gap-1">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, recipient_type: 'all' }))}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                            formData.recipient_type === 'all'
                              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Users className="w-4 h-4 text-emerald-600" />
                          All Users ({usersList.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, recipient_type: 'selected' }))}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                            formData.recipient_type === 'selected'
                              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          Specific Users ({formData.recipients.length} selected)
                        </button>
                      </div>

                      {/* Specific Users Picker matching blade .recipient-picker */}
                      {formData.recipient_type === 'selected' && (
                        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 mt-2 shadow-xs">
                          {/* Toolbar */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSelectAllUsers}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Select All ({filteredUsers.length})
                              </button>
                              <button
                                type="button"
                                onClick={handleClearSelectedUsers}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <X className="w-3.5 h-3.5 text-red-500" /> Clear
                              </button>
                            </div>

                            <span className="text-xs font-bold text-slate-700 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                              {formData.recipients.length} selected
                            </span>
                          </div>

                          {/* Search Input */}
                          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50/50">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search by username or name..."
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                              className="w-full outline-none bg-transparent"
                            />
                            {userSearch && (
                              <button
                                onClick={() => setUserSearch('')}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Users List with Avatars */}
                          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg pr-1">
                            {loadingUsers ? (
                              <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                                <span>Loading users...</span>
                              </div>
                            ) : filteredUsers.length === 0 ? (
                              <div className="py-8 text-center text-slate-400 text-xs">
                                No users found matching "{userSearch}".
                              </div>
                            ) : (
                              filteredUsers.map((user) => {
                                const isSelected = formData.recipients.includes(user.id);
                                const initial = (user.first_name || user.username || 'U')[0].toUpperCase();

                                return (
                                  <label
                                    key={user.id}
                                    onClick={() => toggleUserSelection(user.id)}
                                    className={`flex items-center justify-between p-2.5 hover:bg-slate-50 cursor-pointer transition rounded-md ${
                                      isSelected ? 'bg-blue-50/60' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}} // handled by label click
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                      />
                                      <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {initial}
                                      </span>
                                      <div>
                                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                          <span>{user.username}</span>
                                          {user.status === 1 ? (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-normal">
                                              Active
                                            </span>
                                          ) : (
                                            <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.2 rounded font-normal">
                                              Inactive
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                          {[user.first_name, user.last_name].filter(Boolean).join(' ') ||
                                            user.email ||
                                            'Member'}
                                        </div>
                                      </div>
                                    </div>

                                    {isSelected && (
                                      <span className="text-blue-600 font-bold text-xs flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-xs border border-blue-100">
                                        <Check className="w-3.5 h-3.5" /> Selected
                                      </span>
                                    )}
                                  </label>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Box Footer matching Laravel box-footer text-end */}
                  <div className="box-footer text-end px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submitting ? 'Sending...' : 'Send Announcement'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/announcements')}
                      disabled={submitting}
                      className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: LIST VIEW (Matching All Announcements)
  // ==========================================================================
  return (
    <div className="w-full space-y-6">
      {/* Content Header */}
      <div className="content-header">
        <div className="flex items-center">
          <div className="me-auto">
            <h4 className="page-title text-xl font-bold text-slate-800">Announcements</h4>
            <div className="d-inline-block align-items-center">
              <nav>
                <ol className="breadcrumb flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <li className="breadcrumb-item">
                    <Link to="/admin/dashboard" className="hover:text-slate-800 flex items-center">
                      <Home className="w-3.5 h-3.5" />
                    </Link>
                  </li>
                  <span>/</span>
                  <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                    Announcements
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="content">
        <div className="row">
          <div className="col-12 w-full">
            <div className="box bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              {/* Box Header */}
              <div className="box-header with-border px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="box-title text-base font-bold text-slate-800">All Announcements</h3>
                  <h6 className="box-subtitle text-xs text-slate-500 mt-1">
                    Broadcast notifications sent to registered members.
                  </h6>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/announcements/create')}
                    className="btn btn-sm btn-success bg-[#28a745] hover:bg-[#218838] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" /> Send Announcement
                  </button>
                  <button
                    type="button"
                    onClick={fetchAnnouncements}
                    title="Refresh announcements list"
                    className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Box Body */}
              <div className="box-body p-6">
                {/* Flash Messages */}
                {flashMsg && (
                  <div
                    className={`alert alert-dismissible px-4 py-3 rounded text-xs mb-4 flex items-center justify-between border ${
                      flashMsg.type === 'success'
                        ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]'
                        : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {flashMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{flashMsg.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlashMsg(null)}
                      className="text-current opacity-70 hover:opacity-100 font-bold ml-4"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Filter and Table Tools */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>Show</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(parseInt(e.target.value, 10));
                        setCurrentPage(1);
                      }}
                      className="border border-slate-300 rounded px-2 py-1 text-xs bg-white outline-none"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 w-full sm:w-72 text-xs bg-white">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full outline-none bg-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Responsive */}
                <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
                  <table className="table table-bordered table-hover display nowrap w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3 px-3.5 border-r border-slate-200 w-16 text-center">Sr.No.</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Title</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Message Excerpt</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 text-center w-28">Recipients</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 text-center w-36">Read Status</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 w-36">Sent Date</th>
                        <th className="py-3 px-3.5 text-center w-[170px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingList ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                              <span>Loading announcements...</span>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedAnnouncements.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            {searchQuery ? 'No announcements match your search query.' : 'No broadcast announcements found.'}
                          </td>
                        </tr>
                      ) : (
                        paginatedAnnouncements.map((item, index) => {
                          const serialNo = startIndex + index + 1;
                          const readPct =
                            item.total_recipients > 0
                              ? Math.round((item.read_count / item.total_recipients) * 100)
                              : 0;

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50 transition border-b border-slate-100"
                            >
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center font-medium text-slate-600">
                                {serialNo}
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 font-semibold text-slate-800">
                                <div className="flex items-center gap-2">
                                  <Bell className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>{item.title}</span>
                                </div>
                              </td>
                              <td
                                className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 max-w-[280px]"
                                title={item.description}
                                style={{
                                  maxWidth: '280px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.description}
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {item.total_recipients} Users
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium px-1">
                                    <span>{item.read_count} Read</span>
                                    <span>{readPct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-1.5 rounded-full"
                                      style={{ width: `${readPct}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                                {formatDate(item.created_at)}
                              </td>
                              <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDetails(item)}
                                    className="btn btn-xs btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition"
                                  >
                                    <Eye className="w-3 h-3" /> View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAnnouncementToDelete(item)}
                                    className="btn btn-xs btn-danger bg-[#dc3545] hover:bg-[#c82333] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Entries Info and Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-xs text-slate-500">
                  <div>
                    {totalFiltered === 0 ? (
                      'Showing 0 to 0 of 0 entries'
                    ) : (
                      <>
                        Showing {startIndex + 1} to{' '}
                        {Math.min(startIndex + perPage, totalFiltered)} of {totalFiltered} entries
                        {announcements.length !== totalFiltered &&
                          ` (filtered from ${announcements.length} total)`}
                      </>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={validCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === validCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded border text-xs font-semibold transition ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={validCurrentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
                      >
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" /> {selectedDetails.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sent on {formatDate(selectedDetails.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {selectedDetails.description}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Recipients</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedDetails.total_recipients}
                </span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Read</span>
                <span className="text-sm font-bold text-emerald-700">
                  {selectedDetails.read_count}
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <span className="text-[10px] text-amber-600 uppercase font-bold block">Unread</span>
                <span className="text-sm font-bold text-amber-700">
                  {selectedDetails.unread_count}
                </span>
              </div>
            </div>

            {/* Recipient Users Table */}
            <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Recipient Members</span>
                <div className="w-48">
                  <input
                    type="text"
                    placeholder="Search recipient..."
                    value={detailsSearch}
                    onChange={(e) => setDetailsSearch(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="overflow-y-auto border border-slate-200 rounded-lg max-h-48 divide-y divide-slate-100">
                {filteredDetailsRecipients.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No recipients match your search.
                  </div>
                ) : (
                  filteredDetailsRecipients.map((r) => (
                    <div
                      key={r.id}
                      className="p-2 px-3 flex items-center justify-between text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center">
                          {(r.first_name || r.username || 'U')[0].toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 text-xs">{r.username}</div>
                          <div className="text-[10px] text-slate-400">
                            {[r.first_name, r.last_name].filter(Boolean).join(' ') || r.email || '-'}
                          </div>
                        </div>
                      </div>

                      <div>
                        {r.is_read === 1 ? (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            Read ({formatDate(r.read_at)})
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDetails(null)}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-1.5 rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {announcementToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center border-2 border-amber-300 text-2xl font-bold">
              !
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Are you sure?</h3>
              <p className="text-xs text-slate-500 mt-1">
                The broadcast announcement <span className="font-semibold text-slate-700">"{announcementToDelete.title}"</span> and all member notifications ({announcementToDelete.total_recipients} records) will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-[#dc3545] hover:bg-[#c82333] text-white px-4 py-2 rounded text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete it!'}
              </button>
              <button
                type="button"
                onClick={() => setAnnouncementToDelete(null)}
                disabled={deleting}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold shadow-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
