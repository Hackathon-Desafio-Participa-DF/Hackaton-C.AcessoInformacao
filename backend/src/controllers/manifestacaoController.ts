import type { Request, Response } from 'express';
import { manifestacaoService } from '../services/index.js';
import type { CreateManifestacaoDTO, ListManifestacaoQuery } from '../types/index.js';

export const manifestacaoController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as CreateManifestacaoDTO;

      if (!data.tipo || !data.orgao) {
        res.status(400).json({ error: 'Tipo e órgão são obrigatórios' });
        return;
      }

      const result = await manifestacaoService.create(data);
      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar manifestação';
      res.status(500).json({ error: message });
    }
  },

  async getByProtocolo(req: Request, res: Response): Promise<void> {
    try {
      const { protocolo } = req.params;
      const manifestacao = await manifestacaoService.getByProtocolo(protocolo);
      res.json(manifestacao);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar manifestação';
      if (message === 'Manifestação não encontrada') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(500).json({ error: message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as ListManifestacaoQuery;
      const result = await manifestacaoService.list(query);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao listar manifestações';
      res.status(500).json({ error: message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const manifestacao = await manifestacaoService.getById(id);
      res.json(manifestacao);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar manifestação';
      if (message === 'Manifestação não encontrada') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(500).json({ error: message });
    }
  },

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status é obrigatório' });
        return;
      }

      const manifestacao = await manifestacaoService.updateStatus(id, status);
      res.json(manifestacao);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar status';
      res.status(500).json({ error: message });
    }
  },

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await manifestacaoService.getStats();
      res.json(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar estatísticas';
      res.status(500).json({ error: message });
    }
  },
};
