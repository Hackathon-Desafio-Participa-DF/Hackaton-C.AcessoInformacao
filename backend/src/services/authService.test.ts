import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from './authService.js';
import { gestorRepository } from '../repositories/index.js';

vi.mock('../repositories/index.js', () => ({
  gestorRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

const mockGestor = {
  id: 'gestor-1',
  nome: 'Admin',
  email: 'admin@cgdf.gov.br',
  senha: '$2a$10$hashedpassword',
  orgao: 'CGDF',
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar token e dados do gestor com credenciais validas', async () => {
      const senhaHash = await bcrypt.hash('admin123', 10);
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue({
        ...mockGestor,
        senha: senhaHash,
      });

      const result = await authService.login('admin@cgdf.gov.br', 'admin123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('gestor');
      expect(result.gestor).toEqual({
        id: 'gestor-1',
        nome: 'Admin',
        email: 'admin@cgdf.gov.br',
        orgao: 'CGDF',
      });
      expect(typeof result.token).toBe('string');
    });

    it('deve lancar erro com email inexistente', async () => {
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue(null);

      await expect(authService.login('naoexiste@email.com', 'senha'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lancar erro com senha incorreta', async () => {
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue(mockGestor);

      await expect(authService.login('admin@cgdf.gov.br', 'senhaerrada'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lancar erro quando gestor esta inativo', async () => {
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue({
        ...mockGestor,
        ativo: false,
      });

      await expect(authService.login('admin@cgdf.gov.br', 'admin123'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve gerar token JWT valido', async () => {
      const senhaHash = await bcrypt.hash('admin123', 10);
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue({
        ...mockGestor,
        senha: senhaHash,
      });

      const result = await authService.login('admin@cgdf.gov.br', 'admin123');
      const decoded = jwt.decode(result.token) as Record<string, unknown>;

      expect(decoded).toHaveProperty('id', 'gestor-1');
      expect(decoded).toHaveProperty('email', 'admin@cgdf.gov.br');
      expect(decoded).toHaveProperty('exp');
    });
  });

  describe('verifyToken', () => {
    it('deve retornar payload com token valido', async () => {
      const senhaHash = await bcrypt.hash('admin123', 10);
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue({
        ...mockGestor,
        senha: senhaHash,
      });

      const { token } = await authService.login('admin@cgdf.gov.br', 'admin123');
      const decoded = authService.verifyToken(token);

      expect(decoded).toHaveProperty('id', 'gestor-1');
      expect(decoded).toHaveProperty('nome', 'Admin');
      expect(decoded).toHaveProperty('email', 'admin@cgdf.gov.br');
      expect(decoded).toHaveProperty('orgao', 'CGDF');
    });

    it('deve lancar erro com token invalido', () => {
      expect(() => authService.verifyToken('token-invalido'))
        .toThrow('Token inválido');
    });

    it('deve lancar erro com token expirado', () => {
      const token = jwt.sign(
        { id: 'gestor-1' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '0s' }
      );

      expect(() => authService.verifyToken(token))
        .toThrow('Token inválido');
    });
  });

  describe('createGestor', () => {
    it('deve criar gestor com senha hasheada', async () => {
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(gestorRepository.create).mockResolvedValue(mockGestor);

      await authService.createGestor('Admin', 'novo@cgdf.gov.br', 'senha123', 'CGDF');

      expect(gestorRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Admin',
          email: 'novo@cgdf.gov.br',
          orgao: 'CGDF',
        })
      );

      const callArgs = vi.mocked(gestorRepository.create).mock.calls[0][0];
      expect(callArgs.senha).not.toBe('senha123');
      const isHashed = await bcrypt.compare('senha123', callArgs.senha);
      expect(isHashed).toBe(true);
    });

    it('deve lancar erro se email ja existe', async () => {
      vi.mocked(gestorRepository.findByEmail).mockResolvedValue(mockGestor);

      await expect(authService.createGestor('Admin', 'admin@cgdf.gov.br', 'senha', 'CGDF'))
        .rejects.toThrow('E-mail já cadastrado');
    });
  });
});
