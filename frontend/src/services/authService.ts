import api from './api';
import type { AuthResponse, Gestor, DashboardStats } from '../types';

interface LoginCredentials {
  email: string;
  senha: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, gestor } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('gestor', JSON.stringify(gestor));

    return response.data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('gestor');
  },

  getStoredGestor(): Gestor | null {
    const stored = localStorage.getItem('gestor');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/admin/dashboard');
    return response.data;
  },
};
