import { apiRequest } from './apiClient';

export interface SupportTicketItem {
  id: number;
  ticket: string;
  ticket_number: string;
  subject: string;
  customer_id: number;
  status: number;
  assigned_to: number | null;
  closed_at: string | null;
  priority: string;
  detail: string;
  created_at: string;
  updated_at: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface SupportCommentItem {
  id: number;
  ticket_id: string;
  type: number; // 1 = customer, 0 = admin
  comment: string;
  files: string[];
  is_internal: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface SupportCounts {
  all: number;
  opened: number;
  in_progress: number;
  waiting: number;
  resolved: number;
  closed: number;
}

export interface SupportListResponse {
  tickets: SupportTicketItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  counts: SupportCounts;
}

export interface TicketDetailsResponse {
  ticket: SupportTicketItem;
  comments: SupportCommentItem[];
}

export const adminSupportService = {
  /**
   * Get tickets list with filters and status counts
   */
  async getTickets(params?: {
    status?: string | number;
    ticket_no?: string;
    subject?: string;
    user_name?: string;
    date?: string;
    page?: number;
    limit?: number;
  }): Promise<SupportListResponse> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', String(params.status));
    if (params?.ticket_no) query.set('ticket_no', params.ticket_no);
    if (params?.subject) query.set('subject', params.subject);
    if (params?.user_name) query.set('user_name', params.user_name);
    if (params?.date) query.set('date', params.date);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/support${qs ? `?${qs}` : ''}`;
    const res = await apiRequest<{ success: boolean; data: SupportListResponse }>(endpoint, {
      method: 'GET',
      authScope: 'admin',
    });
    return res.data;
  },

  /**
   * Retrieve ticket details and comment thread
   */
  async getTicketDetails(ticket: string): Promise<TicketDetailsResponse> {
    const res = await apiRequest<{ success: boolean; data: TicketDetailsResponse }>(
      `/admin/support/${ticket}`,
      {
        method: 'GET',
        authScope: 'admin',
      }
    );
    return res.data;
  },

  /**
   * Submit an admin reply
   */
  async replyTicket(
    ticket: string,
    comment: string,
    files?: Array<{ name: string; data: string }>
  ): Promise<{ success: boolean; message: string; data: SupportCommentItem }> {
    return await apiRequest(`/admin/support/reply/${ticket}`, {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify({ comment, files }),
    });
  },

  /**
   * Update ticket status (e.g. 1 = Open, 2 = In Progress, 3 = Waiting, 5 = Resolved, 9 = Closed)
   */
  async updateTicketStatus(
    ticket: string,
    status: number | string
  ): Promise<{ success: boolean; message: string; status: number }> {
    return await apiRequest(`/admin/support/status/${ticket}`, {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify({ status }),
    });
  },
};
