import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { gestorRepository } from '../repositories/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES_IN = '24h';

export const authService = {
  async login(email: string, senha: string) {
    const gestor = await gestorRepository.findByEmail(email);

    if (!gestor || !gestor.ativo) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, gestor.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        id: gestor.id,
        nome: gestor.nome,
        email: gestor.email,
        orgao: gestor.orgao,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      gestor: {
        id: gestor.id,
        nome: gestor.nome,
        email: gestor.email,
        orgao: gestor.orgao,
      },
    };
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as {
        id: string;
        nome: string;
        email: string;
        orgao: string;
      };
    } catch {
      throw new Error('Token inválido');
    }
  },

  async createGestor(nome: string, email: string, senha: string, orgao: string) {
    const existing = await gestorRepository.findByEmail(email);
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return gestorRepository.create({
      nome,
      email,
      senha: senhaHash,
      orgao,
    });
  },
};
