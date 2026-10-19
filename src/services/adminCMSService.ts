
import API_ENDPOINTS, { buildAssetUrl } from '../config/api';

export type CMSContentType = 'testimonial' | 'withdrawal_proof';

export type CMSStatus =
  | 'draft'
  | 'published'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface CMSItem {
  id: number;
  type: CMSContentType;
  title: string;
  member?: string | null;
  description?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  amount?: number | string | null;
  reference?: string | null;
  image_url?: string | null;
  status: CMSStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CMSPayload {
  action: 'create' | 'update' | 'delete' | 'status' | 'list' | 'public_list';
  id?: number;
  type?: CMSContentType;
  title?: string;
  member?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string | null;
  amount?: string | number | null;
  reference?: string | null;
  image?: string;
  imageMimeType?: string;
  status?: CMSStatus;
}

interface CMSResponse {
  success?: boolean;
  message?: string;
  data?: CMSItem[];
  item?: CMSItem;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function requestCMS(
  payload: CMSPayload
): Promise<CMSResponse> {
  const response = await fetch(API_ENDPOINTS.ADMIN.CMS, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'CMS request failed');
  }

  return result;
}

export const adminCMSService = {
  async getAll(): Promise<CMSItem[]> {
    const result = await requestCMS({ action: 'list' });
    return result.data ?? [];
  },

  async getPublic(): Promise<CMSItem[]> {
    const response = await fetch(API_ENDPOINTS.ADMIN.CMS);

    const result: CMSResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Unable to load CMS content');
    }

    return result.data ?? [];
  },

  async create(payload: Omit<CMSPayload, 'action' | 'id'>) {
    return requestCMS({ ...payload, action: 'create' });
  },

  async update(id: number, payload: Omit<CMSPayload, 'action' | 'id'>) {
    return requestCMS({ ...payload, action: 'update', id });
  },

  async delete(id: number) {
    return requestCMS({ action: 'delete', id });
  },

  async updateStatus(id: number, status: CMSStatus) {
    return requestCMS({ action: 'status', id, status });
  },

  assetUrl: buildAssetUrl,
};

export default adminCMSService;
