/**
 * ==============================================================================
 * UNIVERSAL API CLIENT (ADMIN & USER)
 * ==============================================================================
 * Centralized HTTP request client with:
 * - Dynamic global base URL support (via API_BASE_URL)
 * - Automatic Authorization Bearer token injection (admin or user)
 * - Standardized error parsing & timeout support
 * ==============================================================================
 */

import { API_BASE_URL, buildApiUrl } from '../config/api';

export interface RequestOptions extends RequestInit {
  authScope?: 'admin' | 'user' | 'none';
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal fetch wrapper connected to global API_BASE_URL
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { authScope = 'none', timeoutMs = 15000, headers = {}, ...rest } = options;

  // Determine full URL
  const fullUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : buildApiUrl(endpoint);

  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  // If FormData was passed and headers explicitly included Content-Type: application/json, remove it
  if (isFormData && requestHeaders['Content-Type'] === 'application/json') {
    delete requestHeaders['Content-Type'];
  }

  // Auto-detect authScope if 'none' and endpoint indicates /admin or /user
  let effectiveScope = authScope;
  if (effectiveScope === 'none') {
    if (endpoint.includes('/admin') || endpoint.includes('admin/')) {
      effectiveScope = 'admin';
    } else if (endpoint.includes('/user') || endpoint.includes('user/')) {
      effectiveScope = 'user';
    }
  }

  // Inject token based on scope
  if (effectiveScope === 'admin') {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      requestHeaders['Authorization'] = `Bearer ${adminToken}`;
    }
  } else if (effectiveScope === 'user') {
    const userToken = localStorage.getItem('user_token') || localStorage.getItem('token');
    if (userToken) {
      requestHeaders['Authorization'] = `Bearer ${userToken}`;
    }
  }

  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...rest,
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse JSON
    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (responseData && typeof responseData === 'object' && responseData.message) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your network connection.', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network request failed', 0, error);
  }
}

/**
 * Convenience methods for HTTP verbs
 */
export const apiClient = {
  baseUrl: API_BASE_URL,

  get<T = any>(url: string, options?: Omit<RequestOptions, 'method'>) {
    return apiRequest<T>(url, { ...options, method: 'GET' });
  },

  post<T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  },

  put<T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  },

  patch<T = any>(url: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
    });
  },

  delete<T = any>(url: string, options?: Omit<RequestOptions, 'method'>) {
    return apiRequest<T>(url, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
