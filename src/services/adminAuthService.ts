import { API_ENDPOINTS } from '../config/api';

export interface AdminUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  type: string;
  image?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AdminUser;
  requires2fa?: boolean;
  adminId?: number;
}

const AUTH_URLS = API_ENDPOINTS.ADMIN.AUTH;

export const adminAuthService = {
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  getUser(): AdminUser | null {
    const data = localStorage.getItem('admin_user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: AdminUser): void {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    localStorage.setItem('admin_login_time', Date.now().toString());
  },

  clearAuth(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_login_time');
  },

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(AUTH_URLS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; resetLink?: string; token?: string }> {
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
      throw new Error(data.message || 'Invalid or expired password reset token.');
    }
    return data;
  },

  async resetPassword(token: string, password: string, password_confirmation: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(AUTH_URLS.RESET_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, password_confirmation }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reset password.');
    }
    return data;
  },

  async getMe(): Promise<AdminUser> {
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

    localStorage.setItem('admin_user', JSON.stringify(data.user));
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
