import type { Response } from 'express';
import { respostaService, manifestacaoService } from '../services/index.js';
import type { AuthenticatedRequest, CreateRespostaDTO } from '../types/index.js';

export const respostaController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { texto } = req.body as CreateRespostaDTO;

      if (!texto) {
        res.status(400).json({ error: 'Texto da resposta é obrigatório' });
        return;
      }

      if (!req.gestor) {
        res.status(401).json({ error: 'Não autorizado' });
        return;
      }

      await respostaService.create(id, req.gestor.id, texto);
      const manifestacao = await manifestacaoService.getById(id);
      res.status(201).json(manifestacao);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar resposta';
      if (message === 'Manifestação não encontrada') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(500).json({ error: message });
    }
  },
};
