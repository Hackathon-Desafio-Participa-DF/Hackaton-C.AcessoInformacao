import type { Response, NextFunction } from 'express';
import { authService } from '../services/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = authService.verifyToken(token);
    req.gestor = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
