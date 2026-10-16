import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  CheckCircle2,
  User,
  ShieldCheck,
  Paperclip,
  Send,
  ArrowLeft,
  X,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Calendar,
  Eye,
  Download,
  Check,
} from 'lucide-react';
import { buildAssetUrl } from '../../config/api';
import {
  adminSupportService,
  type SupportTicketItem,
  type SupportCounts,
  type TicketDetailsResponse,
} from '../../services/adminSupportService';

export const SupportAdminPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ status?: string; ticket?: string }>();

  // Determine if viewing a specific ticket conversation or list
  const activeTicketCode = params.ticket || (location.pathname.includes('/reply/') ? location.pathname.split('/reply/')[1] : null);

  // Status parameter from route
  const getStatusFromRoute = (): string => {
    if (params.status) {
      const s = params.status.toLowerCase();
      if (s === 'open' || s === 'opened') return 'open';
      if (s === 'answered' || s === 'in-progress' || s === 'in_progress') return 'in_progress';
      if (s === 'customer-reply' || s === 'customer_reply' || s === 'waiting') return 'waiting';
      if (s === 'resolved') return 'resolved';
      if (s === 'closed') return 'closed';
    }
    if (location.pathname.includes('/open')) return 'open';
    if (location.pathname.includes('/answered') || location.pathname.includes('/in-progress')) return 'in_progress';
    if (location.pathname.includes('/customer-reply') || location.pathname.includes('/customer_reply')) return 'waiting';
    if (location.pathname.includes('/resolved')) return 'resolved';
    if (location.pathname.includes('/closed')) return 'closed';
    return 'all';
  };

  const [activeTab, setActiveTab] = useState<string>(getStatusFromRoute());

  useEffect(() => {
    if (!activeTicketCode) {
      setActiveTab(getStatusFromRoute());
    }
  }, [location.pathname, params.status, activeTicketCode]);

  // List State
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [counts, setCounts] = useState<SupportCounts>({
    all: 0,
    opened: 0,
    in_progress: 0,
    waiting: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(15);

  // Filters State
  const [filterTicketNo, setFilterTicketNo] = useState<string>('');
  const [filterUserName, setFilterUserName] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  // Applied Filters
  const [appliedFilters, setAppliedFilters] = useState<{
    ticket_no?: string;
    user_name?: string;
    subject?: string;
    date?: string;
  }>({});

  // Ticket Conversation View State
  const [ticketDetails, setTicketDetails] = useState<TicketDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [replyFiles, setReplyFiles] = useState<Array<{ name: string; data: string }>>([]);
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const [flashMsg, setFlashMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Image Preview Lightbox State
  const [previewImage, setPreviewImage] = useState<{ src: string; name: string } | null>(null);

  // Auto-dismiss flash messages
  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => setFlashMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  // Fetch Tickets List
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminSupportService.getTickets({
        status: activeTab === 'all' ? undefined : activeTab,
        page: currentPage,
        limit: perPage,
        ticket_no: appliedFilters.ticket_no,
        user_name: appliedFilters.user_name,
        subject: appliedFilters.subject,
        date: appliedFilters.date,
      });

      setTickets(res.tickets || []);
      setCounts(res.counts || {
        all: 0,
        opened: 0,
        in_progress: 0,
        waiting: 0,
        resolved: 0,
        closed: 0,
      });
      setTotalRecords(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err: any) {
      console.error('[fetchTickets Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to load tickets.' });
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, perPage, appliedFilters]);

  // Fetch Ticket Details for conversation view
  const fetchTicketDetails = useCallback(async (ticketCode: string) => {
    try {
      setLoadingDetails(true);
      const res = await adminSupportService.getTicketDetails(ticketCode);
      setTicketDetails(res);
    } catch (err: any) {
      console.error('[fetchTicketDetails Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to load ticket conversation.' });
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  // Fetch data on active tab or ticket code change
  useEffect(() => {
    if (activeTicketCode) {
      fetchTicketDetails(activeTicketCode);
    } else {
      fetchTickets();
    }
  }, [activeTicketCode, activeTab, currentPage, perPage, appliedFilters, fetchTicketDetails, fetchTickets]);

  // Tab switch handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    let path = '/admin/support';
    if (tab === 'open') path = '/admin/support/open';
    else if (tab === 'in_progress') path = '/admin/support/answered';
    else if (tab === 'waiting') path = '/admin/support/customer-reply';
    else if (tab === 'resolved') path = '/admin/support/resolved';
    else if (tab === 'closed') path = '/admin/support/closed';
    navigate(path);
  };

  // Filter submit handler
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedFilters({
      ticket_no: filterTicketNo.trim() || undefined,
      user_name: filterUserName.trim() || undefined,
      subject: filterSubject.trim() || undefined,
      date: filterDate.trim() || undefined,
    });
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilterTicketNo('');
    setFilterUserName('');
    setFilterSubject('');
    setFilterDate('');
    setCurrentPage(1);
    setAppliedFilters({});
  };

  // Status Badge Helper matching Laravel TicketController::statusBadge
  const renderStatusBadge = (status: number) => {
    const s = Number(status);
    switch (s) {
      case 1:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#ffc107] text-slate-900 shadow-2xs">
            OPEN
          </span>
        );
      case 2:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#007bff] text-white shadow-2xs">
            IN PROGRESS
          </span>
        );
      case 3:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#17a2b8] text-white shadow-2xs">
            WAITING FOR USER
          </span>
        );
      case 5:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#28a745] text-white shadow-2xs">
            RESOLVED
          </span>
        );
      case 9:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#6c757d] text-white shadow-2xs">
            CLOSED
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
            UNKNOWN
          </span>
        );
    }
  };

  // Priority Badge Helper matching Laravel TicketController::priorityBadge
  const renderPriorityBadge = (priority?: string | null) => {
    const p = (priority || '').toLowerCase().trim();
    if (p === 'urgent') {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#dc3545] text-white">
          Urgent
        </span>
      );
    }
    if (p === 'high') {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#ffc107] text-slate-900">
          High
        </span>
      );
    }
    if (p === 'low') {
      return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#28a745] text-white">
          Low/Informational
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#17a2b8] text-white">
        Normal/Minor impact
      </span>
    );
  };

  // Format Date helper
  const formatDateParts = (isoString?: string | null) => {
    if (!isoString) return { date: '-', time: '' };
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return { date: '-', time: '' };
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const time = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      return { date, time };
    } catch {
      return { date: '-', time: '' };
    }
  };

  // Handle File Input for Admin Reply
  const handleReplyFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setReplyFiles((prev) => [...prev, { name: file.name, data: base64 }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove attached file
  const handleRemoveReplyFile = (index: number) => {
    setReplyFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Admin Reply
  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketCode || !replyMessage.trim()) return;

    try {
      setSubmittingReply(true);
      const res = await adminSupportService.replyTicket(activeTicketCode, replyMessage.trim(), replyFiles);
      setFlashMsg({ type: 'success', text: res.message || 'Reply posted successfully.' });
      setReplyMessage('');
      setReplyFiles([]);
      // Refresh thread
      await fetchTicketDetails(activeTicketCode);
    } catch (err: any) {
      console.error('[handlePostReply Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to submit reply.' });
    } finally {
      setSubmittingReply(false);
    }
  };

  // Update Status Action (Resolve, Close, Reopen)
  const handleUpdateStatus = async (newStatus: number) => {
    if (!activeTicketCode) return;
    try {
      setStatusUpdating(true);
      const res = await adminSupportService.updateTicketStatus(activeTicketCode, newStatus);
      setFlashMsg({ type: 'success', text: res.message || 'Ticket status updated.' });
      await fetchTicketDetails(activeTicketCode);
    } catch (err: any) {
      console.error('[handleUpdateStatus Error]', err);
      setFlashMsg({ type: 'error', text: err?.message || 'Failed to update status.' });
    } finally {
      setStatusUpdating(false);
    }
  };

  // ==========================================================================
  // RENDER: CONVERSATION & REPLY VIEW (Matching view_reply.blade.php)
  // ==========================================================================
  if (activeTicketCode) {
    if (loadingDetails && !ticketDetails) {
      return (
        <div className="w-full space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading conversation history...</p>
          </div>
        </div>
      );
    }

    if (!ticketDetails) {
      return (
        <div className="w-full space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-12 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 mb-1">Ticket Not Found</h4>
            <p className="text-xs text-slate-500 mb-4">The requested support ticket could not be loaded.</p>
            <button
              type="button"
              onClick={() => navigate('/admin/support')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-semibold"
            >
              Back to Tickets List
            </button>
          </div>
        </div>
      );
    }

    const t = ticketDetails.ticket;
    const comments = ticketDetails.comments;

    return (
      <div className="w-full space-y-6">
        {/* Content Header */}
        <div className="content-header">
          <div className="flex items-center">
            <div className="me-auto">
              <h4 className="page-title text-xl font-bold text-slate-800">
                Support Ticket {t.ticket_number || t.ticket}
              </h4>
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
                      <Link to="/admin/support" className="hover:text-slate-800 text-blue-600 hover:underline">
                        Support Tickets
                      </Link>
                    </li>
                    <span>/</span>
                    <li className="breadcrumb-item active text-slate-700 font-semibold" aria-current="page">
                      {t.ticket_number || t.ticket}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/support')}
              className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
            </button>
          </div>
        </div>

        {/* Flash Message Banner */}
        {flashMsg && (
          <div
            className={`alert alert-dismissible px-4 py-3 rounded text-xs flex items-center justify-between border ${
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Ticket Header Card with Metadata & Status Actions */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                  {t.ticket_number || `#${t.ticket}`}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{t.subject}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-800">
                    {[t.first_name, t.last_name].filter(Boolean).join(' ') || 'Customer'}
                  </strong>
                  <span className="text-slate-500">({t.username})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Created: {formatDateParts(t.created_at).date} {formatDateParts(t.created_at).time}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Priority:</span>
                  {renderPriorityBadge(t.priority)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Status:</span>
                  {renderStatusBadge(t.status)}
                </span>
              </div>
            </div>

            {/* Quick Actions matching view_reply.blade.php */}
            <div className="flex items-center gap-2">
              {t.status !== 5 && (
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(5)}
                  className="bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition disabled:opacity-50"
                  title="Mark as Resolved"
                >
                  <Check className="w-3.5 h-3.5" /> Resolve
                </button>
              )}

              {t.status !== 9 ? (
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(9)}
                  className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition disabled:opacity-50"
                  title="Close Ticket"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              ) : (
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(1)}
                  className="bg-[#007bff] hover:bg-[#0069d9] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition disabled:opacity-50"
                  title="Reopen Ticket"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reopen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Thread matching view_reply.blade.php */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Conversation History ({comments.length} messages)</span>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => {
              const isCustomer = comment.type === 1;
              const dateInfo = formatDateParts(comment.created_at || comment.updated_at);

              return (
                <div
                  key={comment.id}
                  className={`flex gap-3.5 ${isCustomer ? 'justify-start' : 'justify-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                      isCustomer
                        ? 'bg-gradient-to-tr from-slate-700 to-slate-900 text-white'
                        : 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white'
                    }`}
                  >
                    {isCustomer ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>

                  {/* Message Card */}
                  <div
                    className={`max-w-2xl rounded-2xl p-4 shadow-xs border ${
                      isCustomer
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-blue-50/70 border-blue-200/80 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="font-bold text-slate-800">
                          {isCustomer
                            ? [t.first_name, t.last_name].filter(Boolean).join(' ') || t.username
                            : 'OpenAid Support Team'}
                        </strong>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isCustomer
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {isCustomer ? 'Customer' : 'Admin'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {dateInfo.date} - {dateInfo.time}
                      </span>
                    </div>

                    {/* Message Body */}
                    <div className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                      {comment.comment}
                    </div>

                    {/* Attachments */}
                    {comment.files && comment.files.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>Attachments ({comment.files.length})</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {comment.files.map((file, fIdx) => {
                            const fileUrl = buildAssetUrl(`uploads/support/${file}`);
                            const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(file);

                            return (
                              <div
                                key={fIdx}
                                className="group relative border border-slate-200 rounded-lg p-1.5 bg-white flex items-center gap-2 hover:border-blue-400 transition cursor-pointer"
                                onClick={() => isImg && setPreviewImage({ src: fileUrl, name: file })}
                              >
                                {isImg ? (
                                  <img
                                    src={fileUrl}
                                    alt={file}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="%23e2e8f0"><rect width="100%" height="100%"/></svg>';
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                                    <Paperclip className="w-5 h-5" />
                                  </div>
                                )}
                                <div className="text-left pr-2">
                                  <div className="text-[11px] font-semibold text-slate-800 max-w-[120px] truncate">
                                    {file}
                                  </div>
                                  <a
                                    href={fileUrl}
                                    download={file}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
                                  >
                                    <Download className="w-2.5 h-2.5" /> Download
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Reply Box matching view_reply.blade.php */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="box-header with-border px-6 py-4 border-b border-slate-200">
            <h4 className="box-title text-base font-bold text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" /> Post Reply
            </h4>
            <h6 className="box-subtitle text-xs text-slate-500 mt-0.5">
              Submitting a reply will automatically mark this ticket as <b>In Progress</b> and notify the user.
            </h6>
          </div>

          <form onSubmit={handlePostReply}>
            <div className="p-6 space-y-4">
              <textarea
                name="reply_comment"
                rows={4}
                required
                placeholder="Type your official support response here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed transition"
              />

              {/* Attachments Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Attach Screenshots / Files (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleReplyFilesChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />

                {replyFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {replyFiles.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-xs border border-slate-200"
                      >
                        <Paperclip className="w-3 h-3 text-slate-500" />
                        <span className="max-w-[140px] truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveReplyFile(i)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="box-footer text-end px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2">
              <button
                type="submit"
                disabled={submittingReply || !replyMessage.trim()}
                className="btn btn-primary bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingReply ? 'Sending Reply...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/support')}
                className="btn btn-secondary bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
          </form>
        </div>

        {/* Lightbox Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full p-2 space-y-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-3 py-1">
                <span className="text-xs font-bold text-slate-700 truncate">{previewImage.name}</span>
                <button onClick={() => setPreviewImage(null)} className="p-1 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={previewImage.src}
                alt={previewImage.name}
                className="max-h-[75vh] w-auto mx-auto object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER: TICKETS LIST VIEW (Matching index.blade.php & _tickets_table.blade.php)
  // ==========================================================================
  return (
    <div className="w-full space-y-6">
      {/* Content Header */}
      <div className="content-header">
        <div className="flex items-center">
          <div className="me-auto">
            <h4 className="page-title text-xl font-bold text-slate-800">Support Tickets</h4>
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
                    Support Tickets
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
              {/* Box Header with Status Tabs matching Laravel admin navigation */}
              <div className="border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-1 px-6 pt-3">
                  <button
                    type="button"
                    onClick={() => handleTabChange('all')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'all'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Tickets</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                      {counts.all}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('open')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'open'
                        ? 'border-amber-500 text-amber-600 bg-amber-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Open</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
                      {counts.opened}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('in_progress')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'in_progress'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>In Progress</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
                      {counts.in_progress}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('waiting')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'waiting'
                        ? 'border-cyan-500 text-cyan-600 bg-cyan-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Waiting For User</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 text-cyan-800">
                      {counts.waiting}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('resolved')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'resolved'
                        ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Resolved</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                      {counts.resolved}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('closed')}
                    className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
                      activeTab === 'closed'
                        ? 'border-slate-600 text-slate-800 bg-slate-100'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>Closed</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                      {counts.closed}
                    </span>
                  </button>
                </div>
              </div>

              {/* Box Body */}
              <div className="box-body p-6 space-y-4">
                {/* Search & Filter Toolbar matching Laravel filterSupport() */}
                <form
                  onSubmit={handleApplyFilters}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ticket Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #TKT-10001"
                      value={filterTicketNo}
                      onChange={(e) => setFilterTicketNo(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Username / Member
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OAI123456"
                      value={filterUserName}
                      onChange={(e) => setFilterUserName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Withdrawal, Deposit"
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Created Date
                    </label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center transition"
                      title="Reset Filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Table Responsive matching _tickets_table.blade.php */}
                <div className="table-responsive overflow-x-auto border border-slate-200 rounded">
                  <table className="table table-bordered table-hover display nowrap w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3 px-3.5 border-r border-slate-200 w-32">Ticket No</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Customer</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Subject</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 text-center w-32">Priority</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 w-36">Date</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 text-center w-36">Status</th>
                        <th className="py-3 px-3.5 text-center w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                              <span>Loading support tickets...</span>
                            </div>
                          </td>
                        </tr>
                      ) : tickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No tickets found.
                          </td>
                        </tr>
                      ) : (
                        tickets.map((t) => {
                          const dateInfo = formatDateParts(t.created_at);

                          return (
                            <tr
                              key={t.id}
                              className="hover:bg-slate-50 transition border-b border-slate-100"
                            >
                              <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-slate-800">
                                {t.ticket_number || `#${t.ticket}`}
                              </td>

                              <td className="py-2.5 px-3.5 border-r border-slate-200">
                                <div className="font-bold text-slate-800">
                                  {[t.first_name, t.last_name].filter(Boolean).join(' ') || 'Customer'}
                                </div>
                                <div className="text-[11px] text-slate-500">{t.username}</div>
                              </td>

                              <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium text-slate-700">
                                {t.subject}
                              </td>

                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                {renderPriorityBadge(t.priority)}
                              </td>

                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-slate-600 whitespace-nowrap">
                                <div>{dateInfo.date}</div>
                                <div className="text-[11px] text-slate-400">{dateInfo.time}</div>
                              </td>

                              <td className="py-2.5 px-3.5 border-r border-slate-200 text-center">
                                {renderStatusBadge(t.status)}
                              </td>

                              <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                                <Link
                                  to={`/admin/support/reply/${t.ticket}`}
                                  className="btn btn-primary btn-xs bg-[#007bff] hover:bg-[#0069d9] text-white px-2.5 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs transition"
                                >
                                  <Eye className="w-3 h-3" /> View
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Entries Info, Page Size, and Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <div>
                      {totalRecords === 0 ? (
                        'Showing 0 to 0 of 0 entries'
                      ) : (
                        <>
                          Showing {(currentPage - 1) * perPage + 1} to{' '}
                          {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      <span>Per page:</span>
                      <select
                        value={perPage}
                        onChange={(e) => {
                          setPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-slate-300 rounded px-1.5 py-0.5 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === currentPage;
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
                        disabled={currentPage >= totalPages}
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
    </div>
  );
};
