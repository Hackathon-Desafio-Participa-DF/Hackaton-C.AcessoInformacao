import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const senhaHash = await bcrypt.hash('admin123', 10);

  const gestor = await prisma.gestor.upsert({
    where: { email: 'admin@cgdf.gov.br' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@cgdf.gov.br',
      senha: senhaHash,
      orgao: 'Controladoria-Geral do Distrito Federal',
    },
  });

  console.log('Created gestor:', gestor.email);

  const manifestacao1 = await prisma.manifestacao.create({
    data: {
      protocolo: '2024-000001',
      tipo: 'RECLAMACAO',
      orgao: 'Secretaria de Estado de Saúde',
      assunto: 'Demora no atendimento da UPA do Gama',
      dataFato: new Date('2024-01-15'),
      horarioFato: '14:30',
      local: 'UPA do Gama, Setor Central, próximo ao terminal rodoviário',
      pessoasEnvolvidas: 'Recepcionista de plantão (não identificada)',
      relato: 'Aguardei mais de 4 horas para ser atendido. Havia aproximadamente 50 pessoas na fila.',
      anonimo: false,
      nome: 'João da Silva',
      email: 'joao@email.com',
      telefone: '(61) 99999-1111',
    },
  });

  const manifestacao2 = await prisma.manifestacao.create({
    data: {
      protocolo: '2024-000002',
      tipo: 'SUGESTAO',
      orgao: 'Secretaria de Estado de Transporte e Mobilidade',
      assunto: 'Criação de ciclovia na via W3 Sul',
      local: 'Via W3 Sul, trecho entre quadras 502 e 516',
      relato: 'Sugiro a criação de uma ciclovia para incentivar o uso de bicicletas. Muitos ciclistas utilizam essa via e correm risco.',
      anonimo: true,
    },
  });

  const manifestacao3 = await prisma.manifestacao.create({
    data: {
      protocolo: '2024-000003',
      tipo: 'ELOGIO',
      orgao: 'Secretaria de Estado de Educação',
      assunto: 'Excelente trabalho da equipe escolar',
      dataFato: new Date('2024-01-10'),
      horarioFato: 'Manhã',
      local: 'CED 01 de Brazlândia, Área Especial, Brazlândia',
      pessoasEnvolvidas: 'Diretora Maria José e equipe pedagógica',
      relato: 'Parabenizo a equipe pelo excelente trabalho com os alunos, especialmente no projeto de reforço escolar.',
      anonimo: false,
      nome: 'Maria Santos',
      email: 'maria@email.com',
    },
  });

  const manifestacao4 = await prisma.manifestacao.create({
    data: {
      protocolo: '2024-000004',
      tipo: 'DENUNCIA',
      orgao: 'Controladoria-Geral do Distrito Federal',
      assunto: 'Uso indevido de veículo oficial',
      dataFato: new Date('2024-01-18'),
      horarioFato: '18:45',
      local: 'Estacionamento do shopping Conjunto Nacional, Brasília',
      pessoasEnvolvidas: 'Servidor não identificado',
      relato: 'Veículo oficial placa OFI-1234 estacionado no shopping em horário fora do expediente. Servidor estava fazendo compras pessoais.',
      anonimo: true,
      status: 'EM_ANALISE',
    },
  });

  const manifestacao5 = await prisma.manifestacao.create({
    data: {
      protocolo: '2024-000005',
      tipo: 'SOLICITACAO',
      orgao: 'Secretaria de Estado de Desenvolvimento Urbano e Habitação',
      assunto: 'Informações sobre o programa Morar DF',
      relato: 'Solicito informações sobre o programa Morar DF, requisitos para participar e documentação necessária.',
      anonimo: false,
      nome: 'Carlos Oliveira',
      email: 'carlos@email.com',
      telefone: '(61) 98888-2222',
      status: 'RESPONDIDA',
    },
  });

  await prisma.resposta.create({
    data: {
      texto: 'Prezado Carlos, o programa Morar DF está com inscrições abertas. Para participar, é necessário ter renda familiar de até 6 salários mínimos e não possuir imóvel próprio. Mais informações em www.codhab.df.gov.br.',
      gestorId: gestor.id,
      manifestacaoId: manifestacao5.id,
    },
  });

  console.log('Created sample manifestacoes:', [
    manifestacao1.protocolo,
    manifestacao2.protocolo,
    manifestacao3.protocolo,
    manifestacao4.protocolo,
    manifestacao5.protocolo,
  ]);

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Email: admin@cgdf.gov.br');
  console.log('  Senha: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
