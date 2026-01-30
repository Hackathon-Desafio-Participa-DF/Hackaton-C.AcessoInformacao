import { describe, it, expect, vi, beforeEach } from 'vitest';
import { respostaService } from './respostaService.js';
import { respostaRepository, manifestacaoRepository } from '../repositories/index.js';

vi.mock('../repositories/index.js', () => ({
  respostaRepository: {
    create: vi.fn(),
    findByManifestacaoId: vi.fn(),
  },
  manifestacaoRepository: {
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

const now = new Date('2026-01-28T12:00:00Z');

const mockManifestacao = {
  id: 'manif-1',
  protocolo: '2026-000001',
  tipo: 'RECLAMACAO',
  orgao: 'CGDF',
  assunto: 'Teste',
  relato: null,
  dataFato: null,
  horarioFato: null,
  local: null,
  pessoasEnvolvidas: null,
  audioUrl: null,
  status: 'RECEBIDA',
  anonimo: true,
  nome: null,
  email: null,
  telefone: null,
  anexos: [],
  respostas: [],
  createdAt: now,
  updatedAt: now,
};

const mockResposta = {
  id: 'resp-1',
  texto: 'Sua demanda foi encaminhada.',
  gestorId: 'gestor-1',
  manifestacaoId: 'manif-1',
  createdAt: now,
  gestor: { nome: 'Admin' },
};

describe('respostaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar resposta e atualizar status para RESPONDIDA', async () => {
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);
      vi.mocked(respostaRepository.create).mockResolvedValue(mockResposta);
      vi.mocked(manifestacaoRepository.updateStatus).mockResolvedValue({
        ...mockManifestacao,
        status: 'RESPONDIDA',
      });

      const result = await respostaService.create('manif-1', 'gestor-1', 'Sua demanda foi encaminhada.');

      expect(result).toEqual({
        id: 'resp-1',
        texto: 'Sua demanda foi encaminhada.',
        gestorId: 'gestor-1',
        gestorNome: 'Admin',
        manifestacaoId: 'manif-1',
        createdAt: now.toISOString(),
      });

      expect(respostaRepository.create).toHaveBeenCalledWith({
        texto: 'Sua demanda foi encaminhada.',
        gestorId: 'gestor-1',
        manifestacaoId: 'manif-1',
      });

      expect(manifestacaoRepository.updateStatus).toHaveBeenCalledWith('manif-1', 'RESPONDIDA');
    });

    it('deve lancar erro se manifestacao nao existe', async () => {
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(null);

      await expect(
        respostaService.create('inexistente', 'gestor-1', 'Texto')
      ).rejects.toThrow('Manifestação não encontrada');

      expect(respostaRepository.create).not.toHaveBeenCalled();
      expect(manifestacaoRepository.updateStatus).not.toHaveBeenCalled();
    });
  });
});
