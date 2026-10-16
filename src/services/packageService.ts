import { API_ENDPOINTS } from '../config/api';
import { adminAuthService } from './adminAuthService';

export interface AdminPackageItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string | null;
  imageUrl: string | null;
  package_type: string;
  items: number;
  status: 'Active' | 'Disabled';
  statusCode: number;
  daily_limit: number;
  dailyLimitLabel: string;
  creditCost: number;
  targetPayout: number;
  donations_count: number;
  donations_volume: number;
  created_at: string;
  updated_at: string;
}

export interface PackagesMeta {
  total_packages: number;
  active_packages: number;
  disabled_packages: number;
  base_activation_fee: number;
  currency_symbol: string;
}

export interface PackagesApiResponse {
  packages: AdminPackageItem[];
  meta: PackagesMeta;
}

export interface SavePackagePayload {
  id?: number;
  title: string;
  price: number;
  daily_limit?: number;
  status: number | string;
  imageBase64?: string;
  package_type?: string;
}

export const packageService = {
  /**
   * Fetch all packages
   */
  async getAllPackages(): Promise<PackagesApiResponse> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(API_ENDPOINTS.ADMIN.PACKAGES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch packages.');
    }
    return data.data;
  },

  /**
   * Fetch single package by ID
   */
  async getPackageById(id: number): Promise<AdminPackageItem> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(`${API_ENDPOINTS.ADMIN.PACKAGES}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch package details.');
    }
    return data.data;
  },

  /**
   * Create new package
   */
  async createPackage(payload: SavePackagePayload): Promise<AdminPackageItem> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(API_ENDPOINTS.ADMIN.PACKAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create package.');
    }
    return data.data;
  },

  /**
   * Update existing package
   */
  async updatePackage(id: number, payload: SavePackagePayload): Promise<AdminPackageItem> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(`${API_ENDPOINTS.ADMIN.PACKAGES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update package.');
    }
    return data.data;
  },

  /**
   * Toggle package status (Active <-> Disabled)
   */
  async togglePackageStatus(id: number): Promise<{ id: number; status: string; statusCode: number }> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(`${API_ENDPOINTS.ADMIN.PACKAGES}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to toggle package status.');
    }
    return data.data;
  },

  /**
   * Delete package
   */
  async deletePackage(id: number): Promise<void> {
    const token = adminAuthService.getToken();
    if (!token) throw new Error('Unauthorized. Please log in.');

    const res = await fetch(`${API_ENDPOINTS.ADMIN.PACKAGES}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete package.');
    }
  },
};
