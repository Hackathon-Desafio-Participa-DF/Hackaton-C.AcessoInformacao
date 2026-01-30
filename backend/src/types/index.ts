import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  gestor?: {
    id: string;
    nome: string;
    email: string;
    orgao: string;
  };
}

export interface CreateManifestacaoDTO {
  tipo: 'RECLAMACAO' | 'SUGESTAO' | 'ELOGIO' | 'DENUNCIA' | 'SOLICITACAO';
  orgao: string;
  assunto: string;
  dataFato?: string;
  horarioFato?: string;
  local?: string;
  pessoasEnvolvidas?: string;
  relato?: string;
  audioUrl?: string;
  anonimo: boolean;
  nome?: string;
  email?: string;
  telefone?: string;
  anexos?: string[];
}

export interface UpdateStatusDTO {
  status: 'RECEBIDA' | 'EM_ANALISE' | 'RESPONDIDA' | 'ARQUIVADA';
}

export interface CreateRespostaDTO {
  texto: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface ListManifestacaoQuery {
  page?: string;
  limit?: string;
  status?: string;
  tipo?: string;
  orgao?: string;
  search?: string;
}

export interface DashboardStats {
  total: number;
  recebidas: number;
  emAnalise: number;
  respondidas: number;
  arquivadas: number;
  porTipo: Record<string, number>;
  porOrgao: Record<string, number>;
}
