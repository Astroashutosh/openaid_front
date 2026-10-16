import apiClient from './apiClient';

export interface ReferralReportItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  from_user_id: number;
  from_username: string;
  from_fullname: string;
  perc: string;
  level: string;
  amount: number;
  description: string;
  date: string;
}

export interface LevelReportItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  from_user_id: number;
  from_username: string;
  from_fullname: string;
  perc: string;
  level: string;
  amount: number;
  description: string;
  date: string;
}

export interface RankRewardReportItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  rank_name: string;
  reward_name: string;
  amount: number;
  status: string;
  description: string;
  date: string;
}

export interface TransactionReportItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  amount: number;
  charge: number;
  new_balance: number;
  transaction_type: string;
  remarks: string;
  description: string;
  date: string;
}

export interface ProtocolFeeReportItem {
  id: number;
  trans_id: string;
  donor_id: number;
  donor_username: string;
  donor_fullname: string;
  donor_email: string;
  donation_id: number;
  donation_amount: number;
  package_name: string;
  rate: string;
  level: string;
  fee_amount: number;
  charge: number;
  new_balance: number;
  remarks: string;
  description: string;
  date: string;
}

export interface ProtocolFeeReportResponse {
  success: boolean;
  data: ProtocolFeeReportItem[];
  total_amount: number;
  metrics: {
    total_fees: number;
    total_operations: number;
    total_donations: number;
    protocol_rate: string;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReportsSummary {
  referral: { count: number; amount: number };
  level: { count: number; amount: number };
  rankReward: { count: number; amount: number };
  protocolFee?: { count: number; amount: number };
  transactions: { count: number; amount: number };
}

export interface ReportListResponse<T> {
  success: boolean;
  data: T[];
  total_amount: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminReportService = {
  getSummary: async (): Promise<{ success: boolean; data: ReportsSummary }> => {
    return apiClient.get<{ success: boolean; data: ReportsSummary }>(
      '/admin/reports/summary',
      { authScope: 'admin' }
    );
  },

  getProtocolFee: async (params?: {
    search?: string;
    uname?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ProtocolFeeReportResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.uname) query.append('uname', params.uname);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/reports/protocol-fee${qs ? `?${qs}` : ''}`;
    return apiClient.get<ProtocolFeeReportResponse>(endpoint, { authScope: 'admin' });
  },

  getReferralCommission: async (params?: {
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportListResponse<ReferralReportItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/reports/referral${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportListResponse<ReferralReportItem>>(endpoint, { authScope: 'admin' });
  },

  getLevelCommission: async (params?: {
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportListResponse<LevelReportItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/reports/level${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportListResponse<LevelReportItem>>(endpoint, { authScope: 'admin' });
  },

  getRankReward: async (params?: {
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportListResponse<RankRewardReportItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/reports/rank-reward${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportListResponse<RankRewardReportItem>>(endpoint, { authScope: 'admin' });
  },

  getAllTransactions: async (params?: {
    uname?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportListResponse<TransactionReportItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.type) query.append('type', params.type);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/reports/transactions${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportListResponse<TransactionReportItem>>(endpoint, { authScope: 'admin' });
  },
};

export default adminReportService;
