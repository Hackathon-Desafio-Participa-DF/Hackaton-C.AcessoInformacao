import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const gestorRepository = {
  async findByEmail(email: string) {
    return prisma.gestor.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return prisma.gestor.findUnique({
      where: { id },
    });
  },

  async create(data: { nome: string; email: string; senha: string; orgao: string }) {
    return prisma.gestor.create({
      data,
    });
  },
};
