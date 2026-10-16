/**
 * ==============================================================================
 * USER (MEMBER) AUTH SERVICE - OPENAID PORTAL
 * ==============================================================================
 * Connects directly to global API_ENDPOINTS.USER.AUTH
 * Changes to VITE_API_BASE_URL immediately apply to this service.
 * ==============================================================================
 */

import { API_ENDPOINTS } from '../config/api';

export interface UserProfile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  full_name?: string;
  username: string;
  email: string;
  mobile?: string;
  phone_no?: string | null;
  country_code?: string | null;
  wallet_address?: string | null;
  type?: string;
  status: number;
  rank_id?: number;
  wallet_balance?: number;
  image?: string | null;
  wallets?: {
    balance: number;
    deposit_balance: number;
    donation_wallet: number;
    donation_withdrawable: number;
    direct_wallet: number;
    level_wallet: number;
    rank_wallet: number;
    total_earning: number;
  };
}

export interface UserLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

const AUTH_URLS = API_ENDPOINTS.USER.AUTH;

export const userAuthService = {
  getToken(): string | null {
    return localStorage.getItem('user_token') || localStorage.getItem('token');
  },

  getUser(): UserProfile | null {
    const data = localStorage.getItem('user_data') || localStorage.getItem('user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: UserProfile): void {
    localStorage.setItem('user_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user_login_time', Date.now().toString());
  },

  clearAuth(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user');
    localStorage.removeItem('user_login_time');
  },

  async login(credentials: { username: string; password: string }): Promise<UserLoginResponse> {
    const res = await fetch(AUTH_URLS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    if (data.token && data.user) {
      this.setAuth(data.token, data.user);
    }

    return data;
  },

  async register(formData: any): Promise<any> {
    const res = await fetch(AUTH_URLS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed.');
    }
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(AUTH_URLS.FORGOT_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to request password reset.');
    }
    return data;
  },

  async verifyResetToken(token: string): Promise<{ success: boolean; email?: string; username?: string }> {
    const res = await fetch(AUTH_URLS.VERIFY_RESET_TOKEN(encodeURIComponent(token)), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Invalid or expired password reset link.');
    }
    return data;
  },

  async resetPassword(payload: { token: string; password: string; password_confirmation: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(AUTH_URLS.RESET_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reset password.');
    }
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token');

    const res = await fetch(AUTH_URLS.ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      this.clearAuth();
      throw new Error(data.message || 'Session expired. Please log in again.');
    }

    localStorage.setItem('user_data', JSON.stringify(data.user));
    return data.user;
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    try {
      if (token) {
        await fetch(AUTH_URLS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearAuth();
    }
  },
};

export default userAuthService;
