import apiClient from './apiClient';

export interface CreditPurchaseItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  amount: number;
  payment_method: string;
  remarks: string;
  description: string;
  date: string;
}

export interface DonationItem {
  id: number;
  trans_id: string;
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  amount: number;
  transaction_type: string;
  donation_type: string;
  remarks: string;
  description: string;
  date: string;
}

export interface PurchaseDonationSummary {
  creditPurchases: {
    count: number;
    amount: number;
  };
  donations: {
    count: number;
    amount: number;
  };
}

export interface ReportResponse<T> {
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

export const adminPurchaseDonationService = {
  getSummary: async (): Promise<{ success: boolean; data: PurchaseDonationSummary }> => {
    return apiClient.get<{ success: boolean; data: PurchaseDonationSummary }>(
      '/admin/purchase-donation/summary',
      { authScope: 'admin' }
    );
  },

  getCreditPurchases: async (params?: {
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportResponse<CreditPurchaseItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/purchase-donation/credit-purchases${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportResponse<CreditPurchaseItem>>(endpoint, { authScope: 'admin' });
  },

  getDonations: async (params?: {
    uname?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportResponse<DonationItem>> => {
    const query = new URLSearchParams();
    if (params?.uname) query.append('uname', params.uname);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/admin/purchase-donation/donations${qs ? `?${qs}` : ''}`;
    return apiClient.get<ReportResponse<DonationItem>>(endpoint, { authScope: 'admin' });
  },
};

export default adminPurchaseDonationService;
