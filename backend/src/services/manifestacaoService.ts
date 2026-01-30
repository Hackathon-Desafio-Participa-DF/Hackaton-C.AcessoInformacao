import { manifestacaoRepository } from '../repositories/index.js';
import { generateProtocolo } from '../utils/protocolo.js';
import type { CreateManifestacaoDTO, ListManifestacaoQuery } from '../types/index.js';

export const manifestacaoService = {
  async create(data: CreateManifestacaoDTO) {
    let protocolo = generateProtocolo();

    let existing = await manifestacaoRepository.findByProtocolo(protocolo);
    while (existing) {
      protocolo = generateProtocolo();
      existing = await manifestacaoRepository.findByProtocolo(protocolo);
    }

    const manifestacao = await manifestacaoRepository.create({
      protocolo,
      tipo: data.tipo,
      orgao: data.orgao,
      assunto: data.assunto,
      dataFato: data.dataFato ? new Date(data.dataFato) : null,
      horarioFato: data.horarioFato || null,
      local: data.local || null,
      pessoasEnvolvidas: data.pessoasEnvolvidas || null,
      relato: data.relato || null,
      audioUrl: data.audioUrl || null,
      anonimo: data.anonimo,
      nome: data.anonimo ? null : data.nome,
      email: data.anonimo ? null : data.email,
      telefone: data.anonimo ? null : data.telefone,
    });

    if (data.anexos && data.anexos.length > 0) {
      for (const url of data.anexos) {
        const tipo = this.detectAnexoTipo(url);
        await manifestacaoRepository.addAnexo(manifestacao.id, url, tipo);
      }
    }

    return {
      manifestacao: await manifestacaoRepository.findById(manifestacao.id),
      protocolo,
    };
  },

  async getByProtocolo(protocolo: string) {
    const manifestacao = await manifestacaoRepository.findByProtocolo(protocolo);
    if (!manifestacao) {
      throw new Error('Manifestacao nao encontrada');
    }
    return this.formatManifestacao(manifestacao);
  },

  async getById(id: string) {
    const manifestacao = await manifestacaoRepository.findById(id);
    if (!manifestacao) {
      throw new Error('Manifestacao nao encontrada');
    }
    return this.formatManifestacao(manifestacao);
  },

  async list(query: ListManifestacaoQuery) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    const result = await manifestacaoRepository.list({
      page,
      limit,
      status: query.status,
      tipo: query.tipo,
      orgao: query.orgao,
      search: query.search,
    });

    return {
      ...result,
      manifestacoes: result.manifestacoes.map(this.formatManifestacao),
    };
  },

  async updateStatus(id: string, status: string) {
    const manifestacao = await manifestacaoRepository.updateStatus(id, status);
    return this.formatManifestacao(manifestacao);
  },

  async getStats() {
    return manifestacaoRepository.getStats();
  },

  detectAnexoTipo(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'webm', 'm4a'];

    if (imageExtensions.includes(extension)) return 'IMAGEM';
    if (videoExtensions.includes(extension)) return 'VIDEO';
    if (audioExtensions.includes(extension)) return 'AUDIO';

    if (url.includes('audio')) return 'AUDIO';
    if (url.includes('video')) return 'VIDEO';

    return 'IMAGEM';
  },

  formatManifestacao(manifestacao: {
    id: string;
    protocolo: string;
    tipo: string;
    orgao: string;
    assunto: string;
    dataFato: Date | null;
    horarioFato: string | null;
    local: string | null;
    pessoasEnvolvidas: string | null;
    relato: string | null;
    audioUrl: string | null;
    status: string;
    anonimo: boolean;
    nome: string | null;
    email: string | null;
    telefone: string | null;
    anexos: Array<{ id: string; url: string; tipo: string }>;
    respostas: Array<{
      id: string;
      texto: string;
      gestorId: string;
      createdAt: Date;
      gestor: { nome: string };
    }>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...manifestacao,
      dataFato: manifestacao.dataFato?.toISOString() || null,
      respostas: manifestacao.respostas.map((r) => ({
        id: r.id,
        texto: r.texto,
        gestorId: r.gestorId,
        gestorNome: r.gestor.nome,
        manifestacaoId: manifestacao.id,
        createdAt: r.createdAt.toISOString(),
      })),
      createdAt: manifestacao.createdAt.toISOString(),
      updatedAt: manifestacao.updatedAt.toISOString(),
    };
  },
};
