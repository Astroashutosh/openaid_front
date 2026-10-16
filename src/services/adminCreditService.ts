import { API_ENDPOINTS } from '../config/api';
import { adminAuthService } from './adminAuthService';

export interface UnallottedCreditItem {
  id: number;
  pinCode: string;
  packageId: number;
  packageTitle: string;
  price: number;
  status: number; // 0 = Available, 1 = Used
  createdAt: string;
}

export interface TransferredCreditItem {
  id: number;
  pinId: number;
  pinCode: string;
  packageTitle: string;
  price: number;
  allotByType: string;
  transferredBy: string;
  transferredByName: string;
  transferredTo: string;
  transferredToName: string;
  transferDate: string;
  pinStatus: number;
  statusText: string;
}

export interface UsedCreditItem {
  id: number;
  pinCode: string;
  price: number;
  consumedByUsername: string;
  consumedByFullName: string;
  status: string;
  updatedAt: string;
}

export interface ActiveCreditPackage {
  id: number;
  title: string;
  price: number;
  pinValue: number;
}

export interface CreditPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: CreditPagination;
}

export interface MemberLookupResult {
  valid: boolean;
  message?: string;
  data?: {
    id: number;
    username: string;
    name: string;
    email: string;
    status: string;
  };
}

export const adminCreditService = {
  /**
   * Fetch active packages for generation and transfer dropdowns
   */
  async getActivePackages(): Promise<ActiveCreditPackage[]> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/packages`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch packages');
    return json.data || [];
  },

  /**
   * Verify member by username
   */
  async checkMember(username: string): Promise<MemberLookupResult> {
    const token = adminAuthService.getToken();
    const res = await fetch(
      `${API_ENDPOINTS.ADMIN.CREDITS}/check-user?username=${encodeURIComponent(username.trim())}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
      }
    );
    const json = await res.json();
    return json;
  },

  /**
   * 1. Get Unallotted Transaction Credits (trans_pin.blade.php)
   */
  async getUnallottedCredits(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResult<UnallottedCreditItem>> {
    const token = adminAuthService.getToken();
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/unallotted?${query.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch unallotted credits');
    return {
      data: json.data || [],
      pagination: json.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  },

  /**
   * Generate new batch of unallotted credits
   */
  async generateCredits(payload: {
    package_id: number;
    quantity: number;
  }): Promise<{ message: string; count: number }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to generate credits');
    return { message: json.message, count: json.count };
  },

  /**
   * Delete an unallotted, unused credit
   */
  async deleteCredit(id: number): Promise<{ message: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete credit');
    return { message: json.message };
  },

  /**
   * 2. Get Transferred Credits Log (transferred_pins.blade.php)
   */
  async getTransferredCredits(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResult<TransferredCreditItem>> {
    const token = adminAuthService.getToken();
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/transferred?${query.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch transferred credits');
    return {
      data: json.data || [],
      pagination: json.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  },

  /**
   * Transfer credits directly to a member
   */
  async transferCredits(payload: {
    username: string;
    package_id: number;
    quantity: number;
  }): Promise<{ message: string; count: number }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to transfer credits');
    return { message: json.message, count: json.count };
  },

  /**
   * 3. Get Used / Consumed Credits Log (used_pin.blade.php)
   */
  async getUsedCredits(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResult<UsedCreditItem>> {
    const token = adminAuthService.getToken();
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_ENDPOINTS.ADMIN.CREDITS}/used?${query.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch used credits');
    return {
      data: json.data || [],
      pagination: json.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  },
};
