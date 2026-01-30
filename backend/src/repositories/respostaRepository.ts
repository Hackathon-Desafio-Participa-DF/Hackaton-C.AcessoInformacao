import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const respostaRepository = {
  async create(data: { texto: string; gestorId: string; manifestacaoId: string }) {
    return prisma.resposta.create({
      data,
      include: {
        gestor: {
          select: { nome: true },
        },
      },
    });
  },

  async findByManifestacaoId(manifestacaoId: string) {
    return prisma.resposta.findMany({
      where: { manifestacaoId },
      include: {
        gestor: {
          select: { nome: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};
