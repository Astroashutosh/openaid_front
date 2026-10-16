import { apiRequest } from './apiClient';

export interface BannerItem {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  description: string | null;
  status: number; // 1 = Active, 0 = Inactive
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BannerInput {
  title: string;
  subtitle?: string;
  description?: string;
  status: number;
  image?: string; // base64 data URL
}

export const adminBannerService = {
  /**
   * Get all banners ordered by sort_order ASC, id ASC
   */
  async getBanners(): Promise<BannerItem[]> {
    const res = await apiRequest<{ success: boolean; data: BannerItem[] }>('/admin/banners', {
      method: 'GET',
      authScope: 'admin',
    });
    return res.data || [];
  },

  /**
   * Get single banner by ID
   */
  async getBannerById(id: number): Promise<BannerItem> {
    const res = await apiRequest<{ success: boolean; data: BannerItem }>(`/admin/banners/${id}`, {
      method: 'GET',
      authScope: 'admin',
    });
    return res.data;
  },

  /**
   * Create a new banner slide
   */
  async createBanner(data: BannerInput): Promise<BannerItem> {
    const res = await apiRequest<{ success: boolean; message: string; data: BannerItem }>('/admin/banners', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Update existing banner slide
   */
  async updateBanner(id: number, data: Partial<BannerInput>): Promise<BannerItem> {
    const res = await apiRequest<{ success: boolean; message: string; data: BannerItem }>(`/admin/banners/${id}`, {
      method: 'PUT',
      authScope: 'admin',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Toggle status between active (1) and inactive (0)
   */
  async toggleBannerStatus(id: number): Promise<{ success: boolean; message: string; banner_status: number }> {
    return await apiRequest(`/admin/banners/${id}/status`, {
      method: 'POST',
      authScope: 'admin',
    });
  },

  /**
   * Delete banner slide
   */
  async deleteBanner(id: number): Promise<{ success: boolean; message: string }> {
    return await apiRequest(`/admin/banners/${id}`, {
      method: 'DELETE',
      authScope: 'admin',
    });
  },
};
