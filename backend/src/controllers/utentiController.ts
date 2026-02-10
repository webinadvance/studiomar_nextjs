import { Request, Response } from 'express';
import * as utentiService from '../services/utentiService';
import { AppError } from '../middleware/errorHandler';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): void {
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError(400, `Invalid email format: ${email}`);
  }
}

function parseId(raw: string): number {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    throw new AppError(400, 'Invalid id parameter');
  }
  return id;
}

export async function list(req: Request, res: Response) {
  const filter = req.query.filter as string | undefined;
  const utenti = await utentiService.getAllUtenti(filter);
  res.json({ data: utenti });
}

export async function getById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const utente = await utentiService.getUtenteById(id);
  res.json({ data: utente });
}

export async function create(req: Request, res: Response) {
  const { nome, cognome, email } = req.body;

  if (email !== undefined && email !== null && email !== '') {
    validateEmail(email);
  }

  const utente = await utentiService.createUtente({ nome, cognome, email }, req.user?.id);
  res.status(201).json({ data: utente });
}

export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const { nome, cognome, email } = req.body;

  if (email !== undefined && email !== null && email !== '') {
    validateEmail(email);
  }

  const data: Partial<{ nome: string; cognome: string; email: string }> = {};
  if (nome !== undefined) data.nome = nome;
  if (cognome !== undefined) data.cognome = cognome;
  if (email !== undefined) data.email = email;

  const utente = await utentiService.updateUtente(id, data);
  res.json({ data: utente });
}

export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const hard = req.query.hard === 'true';

  await utentiService.deleteUtente(id, hard);
  res.status(204).send();
}

export async function listMin(req: Request, res: Response) {
  const utenti = await utentiService.getAllUtentiMin();
  res.json({ data: utenti });
}
