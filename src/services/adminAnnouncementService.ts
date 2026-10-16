import { apiRequest } from './apiClient';

export interface AnnouncementItem {
  id: number;
  title: string;
  description: string;
  total_recipients: number;
  read_count: number;
  unread_count: number;
  created_at: string;
}

export interface AnnouncementRecipient {
  id: number;
  user_id: number;
  title: string;
  description: string;
  is_read: number;
  read_at: string | null;
  created_at: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_status: number;
}

export interface AnnouncementDetails {
  title: string;
  description: string;
  created_at: string;
  total_recipients: number;
  read_count: number;
  unread_count: number;
  recipients: AnnouncementRecipient[];
}

export interface EligibleUser {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  status: number;
}

export interface SendAnnouncementPayload {
  title: string;
  description: string;
  recipient_type: 'all' | 'selected';
  recipients?: number[];
}

export const adminAnnouncementService = {
  /**
   * Fetch all broadcast announcements
   */
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    const res = await apiRequest<{ success: boolean; data: AnnouncementItem[] }>('/admin/announcements', {
      method: 'GET',
      authScope: 'admin',
    });
    return res.data || [];
  },

  /**
   * Fetch details and full recipient list for a broadcast announcement
   */
  async getAnnouncementDetails(title: string): Promise<AnnouncementDetails> {
    const res = await apiRequest<{ success: boolean; data: AnnouncementDetails }>(
      `/admin/announcements/details?title=${encodeURIComponent(title)}`,
      {
        method: 'GET',
        authScope: 'admin',
      }
    );
    return res.data;
  },

  /**
   * Fetch eligible registered users for the recipient picker
   */
  async getEligibleUsers(): Promise<EligibleUser[]> {
    const res = await apiRequest<{ success: boolean; data: EligibleUser[] }>('/admin/announcements/users', {
      method: 'GET',
      authScope: 'admin',
    });
    return res.data || [];
  },

  /**
   * Send a new announcement to all or specific users
   */
  async sendAnnouncement(
    payload: SendAnnouncementPayload
  ): Promise<{ success: boolean; message: string; recipient_count: number }> {
    return await apiRequest('/admin/announcements/send', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete an entire announcement broadcast batch
   */
  async deleteAnnouncement(title: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest('/admin/announcements', {
      method: 'DELETE',
      authScope: 'admin',
      body: JSON.stringify({ title }),
    });
  },
};
