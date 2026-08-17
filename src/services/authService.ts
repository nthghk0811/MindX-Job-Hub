import api from './api';

export interface AuthUser {
  username: string;
  name: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'mindx_auth_token';
const USER_KEY = 'mindx_auth_user';

export const authService = {
  async login(username: string, password: string): Promise<AuthUser> {
    const res = await api.post<LoginResponse>('/auth/login', { username, password });
    if (res.data.success && res.data.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.data.message || 'Đăng nhập không thành công');
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // Validate the parsed object has expected shape
      if (!parsed.username || !parsed.role) {
        this.logout();
        return null;
      }
      return parsed as AuthUser;
    } catch {
      // Corrupt data — clear and force re-login
      this.logout();
      return null;
    }
  },

  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await api.get('/auth/me');
      return res.data.success === true;
    } catch {
      this.logout();
      return false;
    }
  },
};
