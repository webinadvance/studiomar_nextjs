import { Request, Response } from 'express';
import * as scadenzeService from '../services/scadenzeService';
import * as pdfService from '../services/pdfService';
import { AppError } from '../middleware/errorHandler';

export async function list(req: Request, res: Response) {
  const filters: {
    cliente_id?: number;
    utente_id?: number;
    filter?: string;
    date_start?: string;
    date_end?: string;
  } = {};

  if (req.query.cliente_id) {
    const parsed = Number(req.query.cliente_id);
    if (isNaN(parsed)) throw new AppError(400, 'cliente_id must be a number');
    filters.cliente_id = parsed;
  }

  if (req.query.utente_id) {
    const parsed = Number(req.query.utente_id);
    if (isNaN(parsed)) throw new AppError(400, 'utente_id must be a number');
    filters.utente_id = parsed;
  }

  if (req.query.filter) {
    filters.filter = String(req.query.filter);
  }

  if (req.query.date_start) {
    const ds = String(req.query.date_start);
    if (isNaN(Date.parse(ds))) throw new AppError(400, 'date_start must be a valid date');
    filters.date_start = ds;
  }

  if (req.query.date_end) {
    const de = String(req.query.date_end);
    if (isNaN(Date.parse(de))) throw new AppError(400, 'date_end must be a valid date');
    filters.date_end = de;
  }

  const data = await scadenzeService.getAllScadenze(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  res.json({ data });
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, 'id must be a number');

  const data = await scadenzeService.getScadenzaById(id);
  res.json({ data });
}

export async function create(req: Request, res: Response) {
  const { name, rec, date, utente_ids, cliente_ids } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError(400, 'name is required and must be a non-empty string');
  }

  if (rec !== undefined && (typeof rec !== 'number' || rec < 0)) {
    throw new AppError(400, 'rec must be a non-negative number');
  }

  if (date !== undefined && isNaN(Date.parse(date))) {
    throw new AppError(400, 'date must be a valid date string');
  }

  if (utente_ids !== undefined) {
    if (!Array.isArray(utente_ids) || !utente_ids.every((id: any) => typeof id === 'number')) {
      throw new AppError(400, 'utente_ids must be an array of numbers');
    }
  }

  if (cliente_ids !== undefined) {
    if (!Array.isArray(cliente_ids) || !cliente_ids.every((id: any) => typeof id === 'number')) {
      throw new AppError(400, 'cliente_ids must be an array of numbers');
    }
  }

  const data = await scadenzeService.createScadenza(
    {
      name: name.trim(),
      rec,
      date,
      utente_ids,
      cliente_ids,
    },
    req.user?.id
  );

  res.status(201).json({ data });
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, 'id must be a number');

  const { name, rec, date, utente_ids, cliente_ids } = req.body;

  // At least one field must be provided
  if (
    name === undefined &&
    rec === undefined &&
    date === undefined &&
    utente_ids === undefined &&
    cliente_ids === undefined
  ) {
    throw new AppError(400, 'At least one field must be provided for update');
  }

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    throw new AppError(400, 'name must be a non-empty string');
  }

  if (rec !== undefined && (typeof rec !== 'number' || rec < 0)) {
    throw new AppError(400, 'rec must be a non-negative number');
  }

  if (date !== undefined && date !== null && isNaN(Date.parse(date))) {
    throw new AppError(400, 'date must be a valid date string or null');
  }

  if (utente_ids !== undefined) {
    if (!Array.isArray(utente_ids) || !utente_ids.every((id: any) => typeof id === 'number')) {
      throw new AppError(400, 'utente_ids must be an array of numbers');
    }
  }

  if (cliente_ids !== undefined) {
    if (!Array.isArray(cliente_ids) || !cliente_ids.every((id: any) => typeof id === 'number')) {
      throw new AppError(400, 'cliente_ids must be an array of numbers');
    }
  }

  const data = await scadenzeService.updateScadenza(id, {
    name: name?.trim(),
    rec,
    date,
    utente_ids,
    cliente_ids,
  });

  res.json({ data });
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new AppError(400, 'id must be a number');

  const hard = req.query.hard === 'true';

  await scadenzeService.deleteScadenza(id, hard);
  res.status(204).send();
}

export async function exportPDF(req: Request, res: Response) {
  const filters: {
    cliente_id?: number;
    utente_id?: number;
    filter?: string;
    date_start?: string;
    date_end?: string;
  } = {};

  if (req.query.cliente_id) {
    const parsed = Number(req.query.cliente_id);
    if (isNaN(parsed)) throw new AppError(400, 'cliente_id must be a number');
    filters.cliente_id = parsed;
  }

  if (req.query.utente_id) {
    const parsed = Number(req.query.utente_id);
    if (isNaN(parsed)) throw new AppError(400, 'utente_id must be a number');
    filters.utente_id = parsed;
  }

  if (req.query.filter) {
    filters.filter = String(req.query.filter);
  }

  if (req.query.date_start) {
    const ds = String(req.query.date_start);
    if (isNaN(Date.parse(ds))) throw new AppError(400, 'date_start must be a valid date');
    filters.date_start = ds;
  }

  if (req.query.date_end) {
    const de = String(req.query.date_end);
    if (isNaN(Date.parse(de))) throw new AppError(400, 'date_end must be a valid date');
    filters.date_end = de;
  }

  const scadenze = await scadenzeService.getAllScadenze(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const pdfBuffer = await pdfService.generateScadenzePDF(scadenze);

  // Set PDF response headers
  const today = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="scadenze_${today}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);

  res.send(pdfBuffer);
}
