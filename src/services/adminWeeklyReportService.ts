import apiClient from './apiClient';

export interface WeeklyCategorySummary {
  count: number;
  amount: number;
}

export interface WeeklyReportSummary {
  from: string;
  to: string;
  formattedLabel: string;
  userId?: string;
  deposits: WeeklyCategorySummary;
  creditPurchases: WeeklyCategorySummary;
  makeDonations: WeeklyCategorySummary;
}

export interface WeeklyDepositItem {
  id: number;
  user_id: number;
  username: string;
  fullname: string;
  amount: number;
  transaction_hash: string | null;
  status: string;
  date: string;
}

export interface WeeklyCreditItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  amount: number;
  status: string;
  date: string;
}

export interface WeeklyDonationMatchItem {
  id: number;
  sender_id: number;
  sender_username: string;
  sender_fullname: string;
  receiver_id: number;
  receiver_username: string;
  receiver_fullname: string;
  amount: number;
  reference_no: string;
  transaction_hash: string | null;
  status: string;
  date: string;
}

export interface WeeklyReportResponse<T = any> {
  success: boolean;
  summary: WeeklyReportSummary;
  tab: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WeeklyReportQueryParams {
  from_date?: string;
  to_date?: string;
  user_id?: string;
  tab?: 'donate' | 'credits' | 'matches';
  page?: number;
  limit?: number;
}

export const adminWeeklyReportService = {
  getWeeklyReport: async (params: WeeklyReportQueryParams = {}): Promise<WeeklyReportResponse> => {
    const query = new URLSearchParams();
    if (params.from_date) query.append('from_date', params.from_date);
    if (params.to_date) query.append('to_date', params.to_date);
    if (params.user_id) query.append('user_id', params.user_id);
    if (params.tab) query.append('tab', params.tab);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/weekly-report${qs ? `?${qs}` : ''}`;
    return apiClient.get<WeeklyReportResponse>(endpoint, { authScope: 'admin' });
  },
};

export default adminWeeklyReportService;
