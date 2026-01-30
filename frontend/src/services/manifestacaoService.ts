import api from './api';
import type { Manifestacao, ManifestacaoInput } from '../types';

interface CreateManifestacaoResponse {
  manifestacao: Manifestacao;
  protocolo: string;
}

interface ListManifestacaoParams {
  page?: number;
  limit?: number;
  status?: string;
  tipo?: string;
  orgao?: string;
  search?: string;
}

interface ListManifestacaoResponse {
  manifestacoes: Manifestacao[];
  total: number;
  page: number;
  totalPages: number;
}

export const manifestacaoService = {
  async create(data: ManifestacaoInput): Promise<CreateManifestacaoResponse> {
    const response = await api.post<CreateManifestacaoResponse>('/manifestacoes', data);
    return response.data;
  },

  async getByProtocolo(protocolo: string): Promise<Manifestacao> {
    const response = await api.get<Manifestacao>(`/manifestacoes/${protocolo}`);
    return response.data;
  },

  async list(params: ListManifestacaoParams = {}): Promise<ListManifestacaoResponse> {
    const response = await api.get<ListManifestacaoResponse>('/admin/manifestacoes', { params });
    return response.data;
  },

  async getById(id: string): Promise<Manifestacao> {
    const response = await api.get<Manifestacao>(`/admin/manifestacoes/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Manifestacao> {
    const response = await api.patch<Manifestacao>(`/admin/manifestacoes/${id}/status`, { status });
    return response.data;
  },

  async addResposta(id: string, texto: string): Promise<Manifestacao> {
    const response = await api.post<Manifestacao>(`/admin/manifestacoes/${id}/resposta`, { texto });
    return response.data;
  },
};
