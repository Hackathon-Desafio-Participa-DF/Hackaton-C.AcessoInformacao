import type { Request, Response } from 'express';
import { authService } from '../services/index.js';
import type { LoginDTO } from '../types/index.js';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body as LoginDTO;

      if (!email || !senha) {
        res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
        return;
      }

      const result = await authService.login(email, senha);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao realizar login';
      if (message === 'Credenciais inválidas') {
        res.status(401).json({ error: message });
        return;
      }
      res.status(500).json({ error: message });
    }
  },
};
