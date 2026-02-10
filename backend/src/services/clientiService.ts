import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getAllClienti(filter?: string) {
  const where: any = { is_active: true };

  if (filter) {
    where.name = {
      contains: filter,
      mode: 'insensitive',
    };
  }

  return prisma.cliente.findMany({
    where,
    orderBy: { name: 'asc' },
  });
}

export async function getClienteById(id: number) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, is_active: true },
  });

  if (!cliente) {
    throw new AppError(404, `Cliente with id ${id} not found`);
  }

  return cliente;
}

export async function createCliente(data: { name: string }, userId?: number) {
  return prisma.cliente.create({
    data: {
      name: data.name,
      ins_user_id: userId ?? null,
    },
  });
}

export async function updateCliente(id: number, data: Partial<{ name: string }>) {
  // Verify exists and is active
  await getClienteById(id);

  return prisma.cliente.update({
    where: { id },
    data,
  });
}

export async function deleteCliente(id: number, hard?: boolean) {
  // Verify exists
  await getClienteById(id);

  if (hard) {
    return prisma.cliente.delete({
      where: { id },
    });
  }

  return prisma.cliente.update({
    where: { id },
    data: { is_active: false },
  });
}

export async function getAllClientiMin() {
  return prisma.cliente.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });
}
