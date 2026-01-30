export enum TipoManifestacao {
  RECLAMACAO = 'RECLAMACAO',
  SUGESTAO = 'SUGESTAO',
  ELOGIO = 'ELOGIO',
  DENUNCIA = 'DENUNCIA',
  SOLICITACAO = 'SOLICITACAO',
}

export enum StatusManifestacao {
  RECEBIDA = 'RECEBIDA',
  EM_ANALISE = 'EM_ANALISE',
  RESPONDIDA = 'RESPONDIDA',
  ARQUIVADA = 'ARQUIVADA',
}

export enum TipoAnexo {
  IMAGEM = 'IMAGEM',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface Anexo {
  id: string;
  url: string;
  tipo: TipoAnexo;
  manifestacaoId: string;
}

export interface Resposta {
  id: string;
  texto: string;
  gestorId: string;
  gestorNome?: string;
  manifestacaoId: string;
  createdAt: string;
}

export interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: TipoManifestacao;
  orgao: string;
  status: StatusManifestacao;
  anonimo: boolean;

  assunto: string;
  dataFato?: string;
  horarioFato?: string;
  local?: string;
  pessoasEnvolvidas?: string;
  relato?: string;

  audioUrl?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  anexos: Anexo[];
  respostas: Resposta[];
  createdAt: string;
  updatedAt: string;
}

export interface ManifestacaoInput {
  tipo: TipoManifestacao;
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

export interface Gestor {
  id: string;
  nome: string;
  email: string;
  orgao: string;
}

export interface AuthResponse {
  token: string;
  gestor: Gestor;
}

export interface DashboardStats {
  total: number;
  recebidas: number;
  emAnalise: number;
  respondidas: number;
  arquivadas: number;
  porTipo: Record<TipoManifestacao, number>;
  porOrgao: Record<string, number>;
}

export const TIPOS_MANIFESTACAO_LABELS: Record<TipoManifestacao, string> = {
  [TipoManifestacao.RECLAMACAO]: 'Reclamacao',
  [TipoManifestacao.SUGESTAO]: 'Sugestao',
  [TipoManifestacao.ELOGIO]: 'Elogio',
  [TipoManifestacao.DENUNCIA]: 'Denuncia',
  [TipoManifestacao.SOLICITACAO]: 'Solicitacao',
};

export const STATUS_LABELS: Record<StatusManifestacao, string> = {
  [StatusManifestacao.RECEBIDA]: 'Recebida',
  [StatusManifestacao.EM_ANALISE]: 'Em Analise',
  [StatusManifestacao.RESPONDIDA]: 'Respondida',
  [StatusManifestacao.ARQUIVADA]: 'Arquivada',
};

export const ORGAOS_DF = [
  'Secretaria de Estado de Governo',
  'Secretaria de Estado de Economia',
  'Secretaria de Estado de Saude',
  'Secretaria de Estado de Educacao',
  'Secretaria de Estado de Seguranca Publica',
  'Secretaria de Estado de Transporte e Mobilidade',
  'Secretaria de Estado de Desenvolvimento Urbano e Habitacao',
  'Secretaria de Estado de Meio Ambiente',
  'Secretaria de Estado de Desenvolvimento Social',
  'Secretaria de Estado de Cultura e Economia Criativa',
  'Controladoria-Geral do Distrito Federal',
  'Outro',
];

export const HORARIOS_FATO = [
  { value: 'manha', label: 'Manha (06:00 - 12:00)' },
  { value: 'tarde', label: 'Tarde (12:00 - 18:00)' },
  { value: 'noite', label: 'Noite (18:00 - 00:00)' },
  { value: 'madrugada', label: 'Madrugada (00:00 - 06:00)' },
  { value: 'nao_lembro', label: 'Nao lembro' },
];
