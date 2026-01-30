import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import api from './api';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockAuthResponse = {
  token: 'jwt-token-mock',
  gestor: {
    id: 'gestor-1',
    nome: 'Admin',
    email: 'admin@cgdf.gov.br',
    orgao: 'CGDF',
  },
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('deve fazer POST /auth/login e armazenar token e gestor', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockAuthResponse });

      const result = await authService.login({
        email: 'admin@cgdf.gov.br',
        senha: 'admin123',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'admin@cgdf.gov.br',
        senha: 'admin123',
      });
      expect(result).toEqual(mockAuthResponse);
      expect(localStorage.getItem('auth_token')).toBe('jwt-token-mock');
      expect(JSON.parse(localStorage.getItem('gestor')!)).toEqual(mockAuthResponse.gestor);
    });

    it('deve propagar erro da API', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Credenciais invalidas'));

      await expect(
        authService.login({ email: 'x@x.com', senha: 'errada' })
      ).rejects.toThrow('Credenciais invalidas');

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('deve remover token e gestor do localStorage', () => {
      localStorage.setItem('auth_token', 'token');
      localStorage.setItem('gestor', '{}');

      authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('gestor')).toBeNull();
    });
  });

  describe('getStoredGestor', () => {
    it('deve retornar gestor armazenado', () => {
      localStorage.setItem('gestor', JSON.stringify(mockAuthResponse.gestor));

      const gestor = authService.getStoredGestor();

      expect(gestor).toEqual(mockAuthResponse.gestor);
    });

    it('deve retornar null se nao ha gestor armazenado', () => {
      expect(authService.getStoredGestor()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true com token presente', () => {
      localStorage.setItem('auth_token', 'token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('deve retornar false sem token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getDashboardStats', () => {
    it('deve fazer GET /admin/dashboard', async () => {
      const mockStats = {
        total: 10,
        recebidas: 5,
        emAnalise: 3,
        respondidas: 1,
        arquivadas: 1,
        porTipo: {},
        porOrgao: {},
      };
      vi.mocked(api.get).mockResolvedValue({ data: mockStats });

      const result = await authService.getDashboardStats();

      expect(api.get).toHaveBeenCalledWith('/admin/dashboard');
      expect(result).toEqual(mockStats);
    });
  });
});
