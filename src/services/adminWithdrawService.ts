import apiClient from './apiClient';

export interface WithdrawalRecord {
  id: number;
  withdraw_id: string;
  user_id: number;
  amount: number;
  token_price: number;
  token_rate: number;
  charge: number;
  total_amount: number;
  wallet_address: string;
  method_name: string;
  processing_time: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  payment_status: 'pending' | 'pending_payout' | 'completed' | 'failed' | string;
  comment?: string;
  withdraw_wallet?: string;
  transaction_hash?: string;
  bank_info?: string;
  created_at: string;
  updated_at: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  user_balance?: number;
  user_donation_wallet?: number;
}

export interface WithdrawalStats {
  pending_total_count: number;
  pending_total_amount: number;
  approved_total_count: number;
  approved_total_amount: number;
  rejected_total_count: number;
  rejected_total_amount: number;
  total_count: number;
}

export interface WithdrawalResponse {
  success: boolean;
  data: WithdrawalRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: WithdrawalStats;
}

export const adminWithdrawService = {
  getWithdrawals: async (params?: {
    tab?: 'pending' | 'history' | 'all';
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<WithdrawalResponse> => {
    const query = new URLSearchParams();
    if (params?.tab) query.append('tab', params.tab);
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/withdrawals${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<WithdrawalResponse>(endpoint, {
      authScope: 'admin',
    });
    return res;
  },

  getWithdrawalDetails: async (id: number): Promise<{ success: boolean; data: WithdrawalRecord }> => {
    const res = await apiClient.get<{ success: boolean; data: WithdrawalRecord }>(
      `/admin/withdrawals/${id}`,
      { authScope: 'admin' }
    );
    return res;
  },

  processWithdrawal: async (
    id: number,
    data: {
      status: 'approved' | 'rejected';
      message: string;
      transaction_hash?: string;
    }
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    const res = await apiClient.post<{ success: boolean; message: string; data?: any }>(
      `/admin/withdrawals/${id}/process`,
      data,
      { authScope: 'admin' }
    );
    return res;
  },
};

export default adminWithdrawService;
