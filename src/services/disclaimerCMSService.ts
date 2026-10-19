
import API_ENDPOINTS from '../config/api';

export interface DisclaimerSection {
  id: number;
  section_key: string;
  title: string;
  content: string;
  icon: string;
  sort_order: number;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DisclaimerPayload {
  section_key: string;
  title: string;
  content: string;
  icon?: string;
  sort_order?: number;
  is_active?: number | boolean;
}

interface DisclaimerResponse {
  success?: boolean;
  message?: string;
  data?: DisclaimerSection[];
  item?: DisclaimerSection;
}

const getAuthHeaders = (): HeadersInit => {
  const token =
    localStorage.getItem('adminToken') ||
    localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function requestDisclaimer(
  url: string,
  method = 'GET',
  payload?: DisclaimerPayload
): Promise<DisclaimerResponse> {
  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  const result: DisclaimerResponse = await response
    .json()
    .catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Disclaimer request failed (${response.status})`
    );
  }

  return result;
}

const endpoint = API_ENDPOINTS.ADMIN.DISCLAIMER;

export const disclaimerCMSService = {
  async getAll(): Promise<DisclaimerSection[]> {
    const result = await requestDisclaimer(endpoint);
    return result.data ?? [];
  },

  async create(payload: DisclaimerPayload) {
    return requestDisclaimer(endpoint, 'POST', payload);
  },

  async update(id: number, payload: DisclaimerPayload) {
    return requestDisclaimer(`${endpoint}/${id}`, 'PUT', payload);
  },

  async delete(id: number) {
    return requestDisclaimer(`${endpoint}/${id}`, 'DELETE');
  },

  async updateStatus(
    id: number,
    section: DisclaimerSection,
    isActive: boolean
  ) {
    return requestDisclaimer(`${endpoint}/${id}`, 'PUT', {
      section_key: section.section_key,
      title: section.title,
      content: section.content,
      icon: section.icon,
      sort_order: section.sort_order,
      is_active: isActive ? 1 : 0,
    });
  },
};

export default disclaimerCMSService;
