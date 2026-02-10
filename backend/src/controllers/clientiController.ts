import { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import * as clientiService from '../services/clientiService';

export async function list(req: Request, res: Response) {
  const filter = req.query.filter as string | undefined;
  const clienti = await clientiService.getAllClienti(filter);
  res.json({ data: clienti });
}

export async function getById(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid id parameter');
  }

  const cliente = await clientiService.getClienteById(id);
  res.json({ data: cliente });
}

export async function create(req: Request, res: Response) {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError(400, 'Name is required');
  }

  const cliente = await clientiService.createCliente({ name: name.trim() }, req.user?.id);
  res.status(201).json({ data: cliente });
}

export async function update(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid id parameter');
  }

  const { name } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    throw new AppError(400, 'Name must be a non-empty string');
  }

  const data: Partial<{ name: string }> = {};
  if (name !== undefined) {
    data.name = name.trim();
  }

  const cliente = await clientiService.updateCliente(id, data);
  res.json({ data: cliente });
}

export async function remove(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid id parameter');
  }

  const hard = req.query.hard === 'true';
  await clientiService.deleteCliente(id, hard);
  res.status(204).send();
}

export async function listMin(req: Request, res: Response) {
  const clienti = await clientiService.getAllClientiMin();
  res.json({ data: clienti });
}
