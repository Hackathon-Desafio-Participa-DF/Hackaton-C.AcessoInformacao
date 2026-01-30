import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface ListParams {
  page: number;
  limit: number;
  status?: string;
  tipo?: string;
  orgao?: string;
  search?: string;
}

export const manifestacaoRepository = {
  async create(data: Prisma.ManifestacaoCreateInput) {
    return prisma.manifestacao.create({
      data,
      include: {
        anexos: true,
        respostas: {
          include: {
            gestor: {
              select: { nome: true },
            },
          },
        },
      },
    });
  },

  async findByProtocolo(protocolo: string) {
    return prisma.manifestacao.findUnique({
      where: { protocolo },
      include: {
        anexos: true,
        respostas: {
          include: {
            gestor: {
              select: { nome: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.manifestacao.findUnique({
      where: { id },
      include: {
        anexos: true,
        respostas: {
          include: {
            gestor: {
              select: { nome: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  async list({ page, limit, status, tipo, orgao, search }: ListParams) {
    const where: Prisma.ManifestacaoWhereInput = {};

    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    if (orgao) where.orgao = orgao;
    if (search) {
      where.OR = [
        { protocolo: { contains: search } },
        { descricao: { contains: search } },
      ];
    }

    const [manifestacoes, total] = await Promise.all([
      prisma.manifestacao.findMany({
        where,
        include: {
          anexos: true,
          respostas: {
            include: {
              gestor: {
                select: { nome: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.manifestacao.count({ where }),
    ]);

    return {
      manifestacoes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async updateStatus(id: string, status: string) {
    return prisma.manifestacao.update({
      where: { id },
      data: { status },
      include: {
        anexos: true,
        respostas: {
          include: {
            gestor: {
              select: { nome: true },
            },
          },
        },
      },
    });
  },

  async addAnexo(manifestacaoId: string, url: string, tipo: string) {
    return prisma.anexo.create({
      data: {
        url,
        tipo,
        manifestacaoId,
      },
    });
  },

  async getStats() {
    const [total, byStatus, byTipo, byOrgao] = await Promise.all([
      prisma.manifestacao.count(),
      prisma.manifestacao.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.manifestacao.groupBy({
        by: ['tipo'],
        _count: true,
      }),
      prisma.manifestacao.groupBy({
        by: ['orgao'],
        _count: true,
      }),
    ]);

    const statusMap = byStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const tipoMap = byTipo.reduce(
      (acc, item) => {
        acc[item.tipo] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const orgaoMap = byOrgao.reduce(
      (acc, item) => {
        acc[item.orgao] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      recebidas: statusMap['RECEBIDA'] || 0,
      emAnalise: statusMap['EM_ANALISE'] || 0,
      respondidas: statusMap['RESPONDIDA'] || 0,
      arquivadas: statusMap['ARQUIVADA'] || 0,
      porTipo: tipoMap,
      porOrgao: orgaoMap,
    };
  },
};
