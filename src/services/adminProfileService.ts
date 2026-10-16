import { apiRequest } from './apiClient';

export interface AdminProfileData {
  id: number;
  first_name: string;
  last_name: string | null;
  username: string;
  email: string;
  phone_no: string | null;
  address: string | null;
  country: string | number | null;
  image: string | null;
  type: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CountryItem {
  id: number;
  name: string;
}

export interface AdminProfileResponse {
  success: boolean;
  data: AdminProfileData;
  countries: CountryItem[];
}

export const adminProfileService = {
  async getProfile(): Promise<AdminProfileResponse> {
    return await apiRequest<AdminProfileResponse>('/admin/profile', {
      method: 'GET',
      authScope: 'admin',
    });
  },

  async updateProfile(payload: {
    first_name: string;
    last_name?: string;
    phone_no?: string;
    address?: string;
    country?: string | number;
    image?: string;
  }): Promise<{ success: boolean; valid: boolean; message: string; data: AdminProfileData }> {
    return await apiRequest('/admin/profile', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },
};
