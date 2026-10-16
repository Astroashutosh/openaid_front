/**
 * ==============================================================================
 * GLOBAL API CONFIGURATION - OPENAID PORTAL
 * ==============================================================================
 * Single Source of Truth for all API endpoints across the entire frontend.
 * Updating `API_BASE_URL` here (or in `.env` via `VITE_API_BASE_URL`) will
 * automatically propagate to BOTH Admin & User modules across the entire app.
 * ==============================================================================
 */

// Reads from .env (VITE_API_BASE_URL) or defaults to '/api' (Vite proxy/relative)
const ENV_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const API_BASE_URL: string = (ENV_URL && ENV_URL.length > 0)
  ? ENV_URL.replace(/\/+$/, '') // strip trailing slashes
  : '/api';

/**
 * Helper to construct full API endpoint paths cleanly without double slashes.
 * @param path Relative path, e.g. '/admin/auth/login' or 'user/profile'
 */
export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === '/api' || normalizedPath.startsWith('/api/')) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Helper to construct full asset (image/upload) URL.
 * Handles relative paths, proxied paths, and absolute URLs.
 */
export const buildAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (ENV_URL && ENV_URL.startsWith('http')) {
    try {
      const url = new URL(ENV_URL);
      return `${url.origin}${cleanPath}`;
    } catch {
      // Fallback
    }
  }
  return cleanPath;
};

/**
 * Global Modular Endpoints Map for Admin and User
 */
export const API_ENDPOINTS = {
  // Global base url
  BASE: API_BASE_URL,

  // Admin Endpoints
  ADMIN: {
    AUTH: {
      LOGIN: buildApiUrl('/admin/auth/login'),
      FORGOT_PASSWORD: buildApiUrl('/admin/auth/forgot-password'),
      VERIFY_RESET_TOKEN: (token: string) => buildApiUrl(`/admin/auth/verify-reset-token/${token}`),
      RESET_PASSWORD: buildApiUrl('/admin/auth/reset-password'),
      ME: buildApiUrl('/admin/auth/me'),
      LOGOUT: buildApiUrl('/admin/auth/logout'),
    },
    DASHBOARD: buildApiUrl('/admin/dashboard'),
    PACKAGES: buildApiUrl('/admin/packages'),
    CREDITS: buildApiUrl('/admin/credits'),
    MEMBERS: buildApiUrl('/admin/members'),
    DEPOSITS: buildApiUrl('/admin/deposits'),
    RANK_REWARDS: buildApiUrl('/admin/rank-rewards'),
    WITHDRAWALS: buildApiUrl('/admin/withdrawals'),
    REPORTS: buildApiUrl('/admin/reports'),
    SETTINGS: buildApiUrl('/admin/settings'),
  },

  // Common Platform Branding / General Settings
  COMMON: {
    GENERAL_SETTINGS: buildApiUrl('/common/general-settings'),
  },

  // User (Member Portal) Endpoints
  USER: {
    AUTH: {
      LOGIN: buildApiUrl('/user/auth/login'),
      REGISTER: buildApiUrl('/user/auth/register'),
      FORGOT_PASSWORD: buildApiUrl('/user/auth/forgot-password'),
      VERIFY_RESET_TOKEN: (token: string) => buildApiUrl(`/user/auth/verify-reset-token/${token}`),
      RESET_PASSWORD: buildApiUrl('/user/auth/reset-password'),
      ME: buildApiUrl('/user/auth/me'),
      LOGOUT: buildApiUrl('/user/auth/logout'),
    },
    WALLET: buildApiUrl('/user/wallet'),
    DEPOSITS: buildApiUrl('/user/deposits'),
    DONATIONS: buildApiUrl('/user/donations'),
    EPINS: buildApiUrl('/user/epins'),
    REFERRALS: buildApiUrl('/user/referrals'),
    WITHDRAWALS: buildApiUrl('/user/withdrawals'),
    RANK_REWARDS: buildApiUrl('/user/rank-rewards'),
    ACADEMY: buildApiUrl('/user/academy'),
  },
} as const;

export default API_ENDPOINTS;
