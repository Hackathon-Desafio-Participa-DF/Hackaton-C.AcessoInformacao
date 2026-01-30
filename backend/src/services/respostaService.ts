import { respostaRepository, manifestacaoRepository } from '../repositories/index.js';

export const respostaService = {
  async create(manifestacaoId: string, gestorId: string, texto: string) {
    const manifestacao = await manifestacaoRepository.findById(manifestacaoId);

    if (!manifestacao) {
      throw new Error('Manifestação não encontrada');
    }

    const resposta = await respostaRepository.create({
      texto,
      gestorId,
      manifestacaoId,
    });

    await manifestacaoRepository.updateStatus(manifestacaoId, 'RESPONDIDA');

    return {
      id: resposta.id,
      texto: resposta.texto,
      gestorId: resposta.gestorId,
      gestorNome: resposta.gestor.nome,
      manifestacaoId,
      createdAt: resposta.createdAt.toISOString(),
    };
  },
};
