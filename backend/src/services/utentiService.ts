import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getAllUtenti(filter?: string) {
  const where: any = { is_active: true };

  if (filter) {
    where.OR = [
      { nome: { contains: filter, mode: 'insensitive' } },
      { cognome: { contains: filter, mode: 'insensitive' } },
      { email: { contains: filter, mode: 'insensitive' } },
    ];
  }

  return prisma.utente.findMany({
    where,
    orderBy: { id: 'asc' },
  });
}

export async function getUtenteById(id: number) {
  const utente = await prisma.utente.findFirst({
    where: { id, is_active: true },
  });

  if (!utente) {
    throw new AppError(404, `Utente with id ${id} not found`);
  }

  return utente;
}

export async function createUtente(
  data: {
    nome?: string;
    cognome?: string;
    email?: string;
  },
  userId?: number
) {
  return prisma.utente.create({
    data: {
      nome: data.nome ?? null,
      cognome: data.cognome ?? null,
      email: data.email ?? null,
      ins_user_id: userId ?? null,
    },
  });
}

export async function updateUtente(
  id: number,
  data: Partial<{ nome: string; cognome: string; email: string }>
) {
  // Verify record exists and is active
  await getUtenteById(id);

  return prisma.utente.update({
    where: { id },
    data,
  });
}

export async function deleteUtente(id: number, hard = false) {
  // Verify record exists (for hard delete, check even inactive)
  if (hard) {
    const utente = await prisma.utente.findUnique({ where: { id } });
    if (!utente) {
      throw new AppError(404, `Utente with id ${id} not found`);
    }
    return prisma.utente.delete({ where: { id } });
  }

  // Soft delete: verify active record exists first
  await getUtenteById(id);

  return prisma.utente.update({
    where: { id },
    data: { is_active: false },
  });
}

export async function getAllUtentiMin() {
  return prisma.utente.findMany({
    where: { is_active: true },
    select: {
      id: true,
      cognome: true,
      nome: true,
    },
    orderBy: { cognome: 'asc' },
  });
}
