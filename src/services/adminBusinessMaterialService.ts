import { apiRequest } from './apiClient';

export interface BusinessMaterialItem {
  id: number;
  title: string;
  description: string | null;
  file: string | null;
  cover_image: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export const adminBusinessMaterialService = {
  /**
   * List all business materials
   */
  async getMaterials(): Promise<BusinessMaterialItem[]> {
    const res = await apiRequest<{ success: boolean; data: BusinessMaterialItem[] }>(
      '/admin/business-materials',
      {
        method: 'GET',
        authScope: 'admin',
      }
    );
    return res.data || [];
  },

  /**
   * Get material details by ID
   */
  async getMaterialById(id: number): Promise<BusinessMaterialItem> {
    const res = await apiRequest<{ success: boolean; data: BusinessMaterialItem }>(
      `/admin/business-materials/${id}`,
      {
        method: 'GET',
        authScope: 'admin',
      }
    );
    return res.data;
  },

  /**
   * Create new business material
   */
  async createMaterial(payload: {
    title: string;
    description?: string;
    status?: number;
    file?: string;
    file_name?: string;
    cover_image?: string;
    cover_image_name?: string;
  }): Promise<{ success: boolean; message: string; data: BusinessMaterialItem }> {
    return await apiRequest('/admin/business-materials', {
      method: 'POST',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update existing business material
   */
  async updateMaterial(
    id: number,
    payload: {
      title?: string;
      description?: string;
      status?: number;
      file?: string;
      file_name?: string;
      cover_image?: string;
      cover_image_name?: string;
    }
  ): Promise<{ success: boolean; message: string; data: BusinessMaterialItem }> {
    return await apiRequest(`/admin/business-materials/${id}`, {
      method: 'PUT',
      authScope: 'admin',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Toggle material status (Active 1 <-> Inactive 0)
   */
  async toggleStatus(id: number): Promise<{ success: boolean; status: boolean; message: string; value: number }> {
    return await apiRequest(`/admin/business-materials/status/${id}`, {
      method: 'POST',
      authScope: 'admin',
    });
  },

  /**
   * Delete business material
   */
  async deleteMaterial(id: number): Promise<{ success: boolean; status: boolean; message: string }> {
    return await apiRequest(`/admin/business-materials/${id}`, {
      method: 'DELETE',
      authScope: 'admin',
    });
  },
};
