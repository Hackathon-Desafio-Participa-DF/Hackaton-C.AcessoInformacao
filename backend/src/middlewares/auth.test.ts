import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from './auth.js';
import { authService } from '../services/index.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { Response, NextFunction } from 'express';

vi.mock('../services/index.js', () => ({
  authService: {
    verifyToken: vi.fn(),
  },
}));

function createMockReqRes(authHeader?: string) {
  const req = {
    headers: authHeader ? { authorization: authHeader } : {},
  } as unknown as AuthenticatedRequest;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return { req, res, next };
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve chamar next() com token valido', () => {
    const gestorPayload = {
      id: 'gestor-1',
      nome: 'Admin',
      email: 'admin@cgdf.gov.br',
      orgao: 'CGDF',
    };

    vi.mocked(authService.verifyToken).mockReturnValue(gestorPayload);
    const { req, res, next } = createMockReqRes('Bearer token-valido');

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.gestor).toEqual(gestorPayload);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve retornar 401 sem header Authorization', () => {
    const { req, res, next } = createMockReqRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 com header sem prefixo Bearer', () => {
    const { req, res, next } = createMockReqRes('Basic token-qualquer');

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 com token invalido', () => {
    vi.mocked(authService.verifyToken).mockImplementation(() => {
      throw new Error('Token inválido');
    });

    const { req, res, next } = createMockReqRes('Bearer token-invalido');

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve extrair token corretamente removendo "Bearer "', () => {
    vi.mocked(authService.verifyToken).mockReturnValue({
      id: 'g1', nome: 'A', email: 'a@a.com', orgao: 'X',
    });

    const { req, res, next } = createMockReqRes('Bearer meu-token-jwt');

    authMiddleware(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith('meu-token-jwt');
  });
});
