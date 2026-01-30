import { describe, it, expect, vi, beforeEach } from 'vitest';
import { manifestacaoService } from './manifestacaoService.js';
import { manifestacaoRepository } from '../repositories/index.js';

vi.mock('../repositories/index.js', () => ({
  manifestacaoRepository: {
    create: vi.fn(),
    findByProtocolo: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    updateStatus: vi.fn(),
    addAnexo: vi.fn(),
    getStats: vi.fn(),
  },
}));

vi.mock('../utils/protocolo.js', () => ({
  generateProtocolo: vi.fn().mockReturnValue('2026-000001'),
}));

const now = new Date('2026-01-28T12:00:00Z');

const mockManifestacao = {
  id: 'manif-1',
  protocolo: '2026-000001',
  tipo: 'RECLAMACAO',
  orgao: 'Secretaria de Estado de Saude',
  assunto: 'Demora no atendimento',
  relato: 'Aguardei 4 horas na UPA',
  dataFato: now,
  horarioFato: 'tarde',
  local: 'UPA do Gama',
  pessoasEnvolvidas: null,
  audioUrl: null,
  status: 'RECEBIDA',
  anonimo: false,
  nome: 'Joao',
  email: 'joao@email.com',
  telefone: '(61) 99999-1111',
  anexos: [],
  respostas: [],
  createdAt: now,
  updatedAt: now,
};

describe('manifestacaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar manifestacao com protocolo unico', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(null);
      vi.mocked(manifestacaoRepository.create).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);

      const result = await manifestacaoService.create({
        tipo: 'RECLAMACAO',
        orgao: 'Secretaria de Estado de Saude',
        assunto: 'Demora no atendimento',
        relato: 'Aguardei 4 horas na UPA',
        anonimo: false,
        nome: 'Joao',
        email: 'joao@email.com',
      });

      expect(result.protocolo).toBe('2026-000001');
      expect(result.manifestacao).toBeDefined();
      expect(manifestacaoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          protocolo: '2026-000001',
          tipo: 'RECLAMACAO',
          orgao: 'Secretaria de Estado de Saude',
          assunto: 'Demora no atendimento',
          relato: 'Aguardei 4 horas na UPA',
        })
      );
    });

    it('deve gerar novo protocolo se ja existir', async () => {
      // Primeira chamada: protocolo ja existe; segunda: nao existe
      vi.mocked(manifestacaoRepository.findByProtocolo)
        .mockResolvedValueOnce(mockManifestacao)
        .mockResolvedValueOnce(null);
      vi.mocked(manifestacaoRepository.create).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);

      await manifestacaoService.create({
        tipo: 'RECLAMACAO',
        orgao: 'CGDF',
        assunto: 'Teste',
        anonimo: true,
      });

      // Deve ter consultado o protocolo 2 vezes (primeiro existia, segundo nao)
      expect(manifestacaoRepository.findByProtocolo).toHaveBeenCalledTimes(2);
    });

    it('deve omitir dados pessoais quando anonimo', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(null);
      vi.mocked(manifestacaoRepository.create).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);

      await manifestacaoService.create({
        tipo: 'DENUNCIA',
        orgao: 'CGDF',
        assunto: 'Irregularidade',
        anonimo: true,
        nome: 'Joao',
        email: 'joao@email.com',
        telefone: '(61) 99999-0000',
      });

      expect(manifestacaoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          anonimo: true,
          nome: null,
          email: null,
          telefone: null,
        })
      );
    });

    it('deve criar anexos quando fornecidos', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(null);
      vi.mocked(manifestacaoRepository.create).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.addAnexo).mockResolvedValue({
        id: 'anexo-1', url: '/uploads/foto.jpg', tipo: 'IMAGEM',
        manifestacaoId: 'manif-1', createdAt: now,
      });

      await manifestacaoService.create({
        tipo: 'RECLAMACAO',
        orgao: 'CGDF',
        assunto: 'Teste',
        anonimo: true,
        anexos: ['/uploads/foto.jpg', '/uploads/video.mp4'],
      });

      expect(manifestacaoRepository.addAnexo).toHaveBeenCalledTimes(2);
      expect(manifestacaoRepository.addAnexo).toHaveBeenCalledWith('manif-1', '/uploads/foto.jpg', 'IMAGEM');
      expect(manifestacaoRepository.addAnexo).toHaveBeenCalledWith('manif-1', '/uploads/video.mp4', 'VIDEO');
    });

    it('deve converter campos opcionais vazios para null', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(null);
      vi.mocked(manifestacaoRepository.create).mockResolvedValue(mockManifestacao);
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);

      await manifestacaoService.create({
        tipo: 'SUGESTAO',
        orgao: 'CGDF',
        assunto: 'Teste',
        anonimo: true,
        // Campos opcionais nao informados
      });

      expect(manifestacaoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          horarioFato: null,
          local: null,
          pessoasEnvolvidas: null,
          relato: null,
          audioUrl: null,
        })
      );
    });
  });

  describe('getByProtocolo', () => {
    it('deve retornar manifestacao formatada', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(mockManifestacao);

      const result = await manifestacaoService.getByProtocolo('2026-000001');

      expect(result.protocolo).toBe('2026-000001');
      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
    });

    it('deve lancar erro quando protocolo nao existe', async () => {
      vi.mocked(manifestacaoRepository.findByProtocolo).mockResolvedValue(null);

      await expect(manifestacaoService.getByProtocolo('0000-000000'))
        .rejects.toThrow('Manifestacao nao encontrada');
    });
  });

  describe('getById', () => {
    it('deve retornar manifestacao formatada por id', async () => {
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(mockManifestacao);

      const result = await manifestacaoService.getById('manif-1');

      expect(result.id).toBe('manif-1');
      expect(typeof result.dataFato).toBe('string');
    });

    it('deve lancar erro quando id nao existe', async () => {
      vi.mocked(manifestacaoRepository.findById).mockResolvedValue(null);

      await expect(manifestacaoService.getById('inexistente'))
        .rejects.toThrow('Manifestacao nao encontrada');
    });
  });

  describe('list', () => {
    it('deve listar com paginacao padrao', async () => {
      vi.mocked(manifestacaoRepository.list).mockResolvedValue({
        manifestacoes: [mockManifestacao],
        total: 1,
        page: 1,
        totalPages: 1,
      });

      const result = await manifestacaoService.list({});

      expect(manifestacaoRepository.list).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: undefined,
        tipo: undefined,
        orgao: undefined,
        search: undefined,
      });
      expect(result.manifestacoes).toHaveLength(1);
    });

    it('deve aplicar filtros corretamente', async () => {
      vi.mocked(manifestacaoRepository.list).mockResolvedValue({
        manifestacoes: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      await manifestacaoService.list({
        page: '2',
        limit: '5',
        status: 'EM_ANALISE',
        tipo: 'DENUNCIA',
      });

      expect(manifestacaoRepository.list).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        status: 'EM_ANALISE',
        tipo: 'DENUNCIA',
        orgao: undefined,
        search: undefined,
      });
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar e retornar manifestacao formatada', async () => {
      const atualizada = { ...mockManifestacao, status: 'EM_ANALISE' };
      vi.mocked(manifestacaoRepository.updateStatus).mockResolvedValue(atualizada);

      const result = await manifestacaoService.updateStatus('manif-1', 'EM_ANALISE');

      expect(result.status).toBe('EM_ANALISE');
      expect(manifestacaoRepository.updateStatus).toHaveBeenCalledWith('manif-1', 'EM_ANALISE');
    });
  });

  describe('getStats', () => {
    it('deve retornar estatisticas', async () => {
      const stats = {
        total: 10,
        recebidas: 5,
        emAnalise: 3,
        respondidas: 1,
        arquivadas: 1,
        porTipo: { RECLAMACAO: 5, SUGESTAO: 3, ELOGIO: 2 },
        porOrgao: { 'CGDF': 10 },
      };
      vi.mocked(manifestacaoRepository.getStats).mockResolvedValue(stats);

      const result = await manifestacaoService.getStats();

      expect(result).toEqual(stats);
    });
  });

  describe('detectAnexoTipo', () => {
    it('deve detectar imagens por extensao', () => {
      expect(manifestacaoService.detectAnexoTipo('/uploads/foto.jpg')).toBe('IMAGEM');
      expect(manifestacaoService.detectAnexoTipo('/uploads/foto.jpeg')).toBe('IMAGEM');
      expect(manifestacaoService.detectAnexoTipo('/uploads/foto.png')).toBe('IMAGEM');
      expect(manifestacaoService.detectAnexoTipo('/uploads/foto.gif')).toBe('IMAGEM');
      expect(manifestacaoService.detectAnexoTipo('/uploads/foto.webp')).toBe('IMAGEM');
    });

    it('deve detectar videos por extensao', () => {
      expect(manifestacaoService.detectAnexoTipo('/uploads/video.mp4')).toBe('VIDEO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/video.webm')).toBe('VIDEO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/video.avi')).toBe('VIDEO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/video.mov')).toBe('VIDEO');
    });

    it('deve detectar audio por extensao', () => {
      expect(manifestacaoService.detectAnexoTipo('/uploads/audio.mp3')).toBe('AUDIO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/audio.wav')).toBe('AUDIO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/audio.ogg')).toBe('AUDIO');
    });

    it('deve detectar audio/video pela url quando sem extensao conhecida', () => {
      expect(manifestacaoService.detectAnexoTipo('/uploads/audio-recording')).toBe('AUDIO');
      expect(manifestacaoService.detectAnexoTipo('/uploads/video-capture')).toBe('VIDEO');
    });

    it('deve retornar IMAGEM como fallback', () => {
      expect(manifestacaoService.detectAnexoTipo('/uploads/arquivo.xyz')).toBe('IMAGEM');
    });
  });

  describe('formatManifestacao', () => {
    it('deve converter datas para ISO string', () => {
      const manifComResposta = {
        ...mockManifestacao,
        respostas: [{
          id: 'resp-1',
          texto: 'Resposta teste',
          gestorId: 'gestor-1',
          createdAt: now,
          gestor: { nome: 'Admin' },
        }],
      };

      const result = manifestacaoService.formatManifestacao(manifComResposta);

      expect(result.createdAt).toBe(now.toISOString());
      expect(result.updatedAt).toBe(now.toISOString());
      expect(result.dataFato).toBe(now.toISOString());
      expect(result.respostas[0].createdAt).toBe(now.toISOString());
      expect(result.respostas[0].gestorNome).toBe('Admin');
    });

    it('deve retornar dataFato null quando nao informada', () => {
      const semData = { ...mockManifestacao, dataFato: null };
      const result = manifestacaoService.formatManifestacao(semData);
      expect(result.dataFato).toBeNull();
    });
  });
});
