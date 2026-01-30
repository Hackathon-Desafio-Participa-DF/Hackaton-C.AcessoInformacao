import { describe, it, expect, vi, beforeEach } from 'vitest';
import { manifestacaoService } from './manifestacaoService';
import api from './api';
import { TipoManifestacao, StatusManifestacao, type Manifestacao } from '../types';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockManifestacao: Manifestacao = {
  id: 'manif-1',
  protocolo: '2026-000001',
  tipo: TipoManifestacao.RECLAMACAO,
  orgao: 'CGDF',
  status: StatusManifestacao.RECEBIDA,
  anonimo: true,
  assunto: 'Teste',
  anexos: [],
  respostas: [],
  createdAt: '2026-01-28T12:00:00.000Z',
  updatedAt: '2026-01-28T12:00:00.000Z',
};

describe('manifestacaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve fazer POST /manifestacoes com os dados', async () => {
      const responseData = { manifestacao: mockManifestacao, protocolo: '2026-000001' };
      vi.mocked(api.post).mockResolvedValue({ data: responseData });

      const input = {
        tipo: TipoManifestacao.RECLAMACAO,
        orgao: 'CGDF',
        assunto: 'Teste',
        relato: 'Descricao do fato',
        anonimo: true,
      };

      const result = await manifestacaoService.create(input);

      expect(api.post).toHaveBeenCalledWith('/manifestacoes', input);
      expect(result.protocolo).toBe('2026-000001');
    });
  });

  describe('getByProtocolo', () => {
    it('deve fazer GET /manifestacoes/:protocolo', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockManifestacao });

      const result = await manifestacaoService.getByProtocolo('2026-000001');

      expect(api.get).toHaveBeenCalledWith('/manifestacoes/2026-000001');
      expect(result.protocolo).toBe('2026-000001');
    });
  });

  describe('list', () => {
    it('deve fazer GET /admin/manifestacoes com parametros', async () => {
      const listResponse = {
        manifestacoes: [mockManifestacao],
        total: 1,
        page: 1,
        totalPages: 1,
      };
      vi.mocked(api.get).mockResolvedValue({ data: listResponse });

      const params = { page: 1, limit: 10, status: 'RECEBIDA' };
      const result = await manifestacaoService.list(params);

      expect(api.get).toHaveBeenCalledWith('/admin/manifestacoes', { params });
      expect(result.manifestacoes).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('deve funcionar sem parametros', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { manifestacoes: [], total: 0, page: 1, totalPages: 0 },
      });

      await manifestacaoService.list();

      expect(api.get).toHaveBeenCalledWith('/admin/manifestacoes', { params: {} });
    });
  });

  describe('getById', () => {
    it('deve fazer GET /admin/manifestacoes/:id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockManifestacao });

      const result = await manifestacaoService.getById('manif-1');

      expect(api.get).toHaveBeenCalledWith('/admin/manifestacoes/manif-1');
      expect(result.id).toBe('manif-1');
    });
  });

  describe('updateStatus', () => {
    it('deve fazer PATCH /admin/manifestacoes/:id/status', async () => {
      const updated = { ...mockManifestacao, status: StatusManifestacao.EM_ANALISE };
      vi.mocked(api.patch).mockResolvedValue({ data: updated });

      const result = await manifestacaoService.updateStatus('manif-1', 'EM_ANALISE');

      expect(api.patch).toHaveBeenCalledWith('/admin/manifestacoes/manif-1/status', {
        status: 'EM_ANALISE',
      });
      expect(result.status).toBe(StatusManifestacao.EM_ANALISE);
    });
  });

  describe('addResposta', () => {
    it('deve fazer POST /admin/manifestacoes/:id/resposta', async () => {
      const withResposta = {
        ...mockManifestacao,
        respostas: [{
          id: 'resp-1',
          texto: 'Resposta do gestor',
          gestorId: 'g1',
          gestorNome: 'Admin',
          manifestacaoId: 'manif-1',
          createdAt: '2026-01-28T12:00:00.000Z',
        }],
      };
      vi.mocked(api.post).mockResolvedValue({ data: withResposta });

      const result = await manifestacaoService.addResposta('manif-1', 'Resposta do gestor');

      expect(api.post).toHaveBeenCalledWith('/admin/manifestacoes/manif-1/resposta', {
        texto: 'Resposta do gestor',
      });
      expect(result.respostas).toHaveLength(1);
    });
  });
});
