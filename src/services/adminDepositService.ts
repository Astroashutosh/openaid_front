import { API_ENDPOINTS } from '../config/api';
import { adminAuthService } from './adminAuthService';

export interface DepositItem {
  id: number;
  srNo: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  transId: string;
  amount: number;
  rate: number;
  myrAmount: number;
  method: string;
  wallet: string;
  paymentMode: 'blockchain' | 'manual' | string;
  transactionHash: string | null;
  paymentReceipt: string | null;
  receiptUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: number | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepositStats {
  totalApprovedAmount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}

export interface DepositsResponse {
  data: DepositItem[];
  stats: DepositStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminDepositService = {
  /**
   * Fetch deposits with server-side filtering, search, and pagination
   */
  async getDeposits(params?: {
    type?: 'pending' | 'all';
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<DepositsResponse> {
    const token = adminAuthService.getToken();
    const query = new URLSearchParams();

    if (params?.type) query.append('type', params.type);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_ENDPOINTS.ADMIN.DEPOSITS}?${query.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch deposits');

    return {
      data: json.data || [],
      stats: json.stats || {
        totalApprovedAmount: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        totalCount: 0,
      },
      pagination: json.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  },

  /**
   * Approve a pending deposit and credit user's Deposit Wallet
   */
  async approveDeposit(id: number): Promise<{ message: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.DEPOSITS}/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to approve deposit');
    return { message: json.message || json.msg };
  },

  /**
   * Reject a pending deposit with reason
   */
  async rejectDeposit(id: number, reason: string): Promise<{ message: string }> {
    const token = adminAuthService.getToken();
    const res = await fetch(`${API_ENDPOINTS.ADMIN.DEPOSITS}/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ reason }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to reject deposit');
    return { message: json.message || json.msg };
  },
};

export default adminDepositService;
