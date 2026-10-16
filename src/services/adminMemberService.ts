import { API_ENDPOINTS } from '../config/api';
import { adminAuthService } from './adminAuthService';

export interface AdminMemberItem {
  id: number;
  srNo: number;
  image: string;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sponsorId: string;
  sponsorName: string;
  rankName: string;
  status: 'Active' | 'Inactive';
  statusCode: number;
  isBlocked: boolean;
  isSuspended: boolean;
  registerDate: string;
  country: string;
  countryId: string | number;
  walletBalance: number;
}

export interface MemberCounts {
  all: number;
  active: number;
  inactive: number;
  blocked: number;
  suspended: number;
}

export interface MemberCountry {
  id: number;
  name: string;
  iso: string;
}

export interface MemberPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MembersResponse {
  data: AdminMemberItem[];
  counts: MemberCounts;
  pagination: MemberPagination;
}

export const adminMemberService = {
  /**
   * Fetch all countries for the filter dropdown
   */
  async getCountries(): Promise<MemberCountry[]> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/countries`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch countries');
    return json.data || [];
  },

  /**
   * Fetch paginated members list with filtering
   */
  async getMembers(params?: {
    type?: string;
    page?: number;
    limit?: number;
    search?: string;
    country?: string | number;
  }): Promise<MembersResponse> {
    const token = adminAuthService.getToken();
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.country) query.append('country', String(params.country));

    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}?${query.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch members');
    return {
      data: json.data || [],
      counts: json.counts || { all: 0, active: 0, inactive: 0, blocked: 0, suspended: 0 },
      pagination: json.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  },

  /**
   * Update member status (block, unblock, suspend, unsuspend, activate)
   */
  async updateStatus(payload: {
    id: number;
    action: 'block' | 'unblock' | 'suspend' | 'unsuspend' | 'toggle_active';
  }): Promise<{ message: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update member status');
    return { message: json.message || json.msg };
  },

  /**
   * Update member password (login password or transaction password)
   */
  async updatePassword(payload: {
    user_id: number;
    password_type: 'password' | 'transaction_password';
    new_password: string;
  }): Promise<{ message: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update password');
    return { message: json.message };
  },

  /**
   * Impersonate / Login as member
   */
  async impersonate(id: number): Promise<{ token: string; redirectUrl: string; message: string; user?: any }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/impersonate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to impersonate member');
    return json;
  },

  /**
   * Fetch comprehensive profile details for a member
   */
  async getProfile(id: number | string): Promise<MemberProfileData> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/${id}/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch member profile');
    return json.data;
  },

  /**
   * Update member personal, contact, and bank details
   */
  async updateProfile(id: number | string, payload: any): Promise<{ message: string; image?: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.MEMBERS}/${id}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update profile');
    return { message: json.message || json.msg, image: json.image };
  },
};

export interface MemberProfileData {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  countryId: string | number;
  countryName: string;
  countryIso: string;
  image: string;
  imageUrl: string | null;
  status: 'Active' | 'Inactive';
  statusCode: number;
  isBlocked: boolean;
  isSuspended: boolean;
  isKyc: number | string;
  createdAt: string;
  rankName: string;
  packagePrice?: number;
  walletBalance: number;
  directReferrals: number;
  sponsorId: string;
  sponsorName: string;
  address: string;
  city: string;
  state: string;
  district: string;
  nricNumber: string;
  nricImage: string | null;
  bankName: string;
  bankBranch: string;
  accountNo: string;
  accountHolderName: string;
  accountType: string;
  bankCode: string;
}

