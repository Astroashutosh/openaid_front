import { apiRequest } from './apiClient';

export interface GeneralSettingsData {
  id: number;
  web_title: string;
  currency: string;
  symbol: string;
  logo: string | null;
  logo2: string | null;
  icon: string | null;
  qrcode: string | null;
  from_email: string | null;
  withdraw_fee: number;
  min_withdraw: number;
  max_withdraw: number;
  min_deposit: number;
  is_withdraw_enable: string;
  admin_usdt_address: string | null;
  company_usdt_address: string | null;
  company_withdraw_usdt_address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ChargeSettingsData {
  withdraw_fee: number;
  min_withdraw: number;
  max_withdraw: number;
  min_deposit: number;
  is_withdraw_enable: string;
}

export interface RankItem {
  id: number;
  rank_name: string;
  directs: number;
  referral_commission: number;
  reward_amount: number;
  reward_name: string;
  reward_name_array?: string[];
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LevelItem {
  id: number;
  direct_referrals: number;
  commission: number;
  total_sale: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentSettingsData {
  admin_usdt_address: string;
  qrcode: string;
  company_usdt_address: string;
  company_withdraw_usdt_address: string;
  has_private_key: boolean;
  admin_email: string;
  masked_admin_email: string;
}

export const adminSettingsService = {
  /**
   * 1. General Settings
   */
  async getGeneralSettings(): Promise<GeneralSettingsData> {
    const res = await apiRequest<{ success: boolean; data: GeneralSettingsData }>(
      '/admin/settings/general',
      { method: 'GET', authScope: 'admin' }
    );
    return res.data;
  },

  async updateGeneralSettings(payload: {
    web_title?: string;
    currency?: string;
    symbol?: string;
    logo?: string;
    favicon?: string;
  }): Promise<{ success: boolean; message: string; data: GeneralSettingsData }> {
    return await apiRequest('/admin/settings/general', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 2. Charge & Limits Settings
   */
  async getChargeSettings(): Promise<ChargeSettingsData> {
    const res = await apiRequest<{ success: boolean; data: ChargeSettingsData }>(
      '/admin/settings/charges',
      { method: 'GET', authScope: 'admin' }
    );
    return res.data;
  },

  async updateChargeSettings(payload: {
    withdraw_fee: number;
    min_withdraw: number;
    is_withdraw_enable: boolean | string;
  }): Promise<{ success: boolean; message: string; data: ChargeSettingsData }> {
    return await apiRequest('/admin/settings/charges', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 3. Rank Settings
   */
  async getRanks(): Promise<RankItem[]> {
    const res = await apiRequest<{ success: boolean; data: RankItem[] }>(
      '/admin/settings/ranks',
      { method: 'GET', authScope: 'admin' }
    );
    return res.data || [];
  },

  async updateRank(
    id: number,
    payload: {
      rank_name: string;
      directs: number;
      referral_commission: number;
      reward_amount: number;
      reward_name: string[] | string;
    }
  ): Promise<{ success: boolean; message: string; data: RankItem }> {
    return await apiRequest(`/admin/settings/ranks/${id}`, {
      method: 'PUT',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 4. Level Commission Settings
   */
  async getLevels(): Promise<LevelItem[]> {
    const res = await apiRequest<{ success: boolean; data: LevelItem[] }>(
      '/admin/settings/levels',
      { method: 'GET', authScope: 'admin' }
    );
    return res.data || [];
  },

  async updateLevel(
    id: number,
    payload: {
      direct_referrals: number;
      commission: number;
    }
  ): Promise<{ success: boolean; message: string; data: LevelItem }> {
    return await apiRequest(`/admin/settings/levels/${id}`, {
      method: 'PUT',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 5. Payment Settings & OTP
   */
  async getPaymentSettings(): Promise<PaymentSettingsData> {
    const res = await apiRequest<{ success: boolean; data: PaymentSettingsData }>(
      '/admin/settings/payment',
      { method: 'GET', authScope: 'admin' }
    );
    return res.data;
  },

  async sendPaymentOtp(): Promise<{ success: boolean; valid: boolean; message: string; otp?: string }> {
    return await apiRequest('/admin/settings/payment/send-otp', {
      method: 'POST',
      authScope: 'admin',
    });
  },

  async updatePaymentSettings(payload: {
    otp: string;
    admin_usdt_address?: string;
    qrcode?: string;
    private_key?: string;
  }): Promise<{ success: boolean; valid: boolean; message: string }> {
    return await apiRequest('/admin/settings/payment/update', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * 6. Admin Security & Password Change
   */
  async changePassword(payload: {
    old_password: string;
    password: string;
    confirm_password: string;
  }): Promise<{ success: boolean; message: string }> {
    return await apiRequest('/admin/settings/change-password', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },
};
