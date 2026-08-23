import api from './api';

export interface AuthUser {
  id?: string;
  username: string;
  name: string;
  role: 'admin' | 'student';
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  course?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
  code?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

const TOKEN_KEY = 'mindx_auth_token';
const USER_KEY = 'mindx_auth_user';

export const authService = {
  async login(username: string, password: string): Promise<AuthUser> {
    const res = await api.post<LoginResponse>('/auth/login', { username, password });
    if (res.data.success && res.data.token && res.data.user) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.data.message || 'Đăng nhập không thành công');
  },

  async register(payload: RegisterPayload): Promise<{ message: string }> {
    const res = await api.post<RegisterResponse>('/auth/register', payload);
    if (res.data.success) return { message: res.data.message };
    throw new Error(res.data.message || 'Đăng ký không thành công');
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
      if (!parsed.username || !parsed.role) {
        this.logout();
        return null;
      }
      return parsed as AuthUser;
    } catch {
      this.logout();
      return null;
    }
  },

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
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
