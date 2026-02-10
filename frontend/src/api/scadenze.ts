import client from './client';
import type {
  ScadenzeWithRelations,
  ScadenzeCreateRequest,
  ScadenzeUpdateRequest,
} from '../../../shared';

export interface ScadenzeFilters {
  cliente_id?: number;
  utente_id?: number;
  filter?: string;
  date_start?: string;
  date_end?: string;
}

export async function getScadenze(filters?: ScadenzeFilters): Promise<ScadenzeWithRelations[]> {
  const params: Record<string, string | number> = {};
  if (filters?.cliente_id) params.cliente_id = filters.cliente_id;
  if (filters?.utente_id) params.utente_id = filters.utente_id;
  if (filters?.filter) params.filter = filters.filter;
  if (filters?.date_start) params.date_start = filters.date_start;
  if (filters?.date_end) params.date_end = filters.date_end;

  const { data } = await client.get<ScadenzeWithRelations[]>('/v1/scadenze', { params });
  return data;
}

export async function getScadenzaById(id: number): Promise<ScadenzeWithRelations> {
  const { data } = await client.get<ScadenzeWithRelations>(`/v1/scadenze/${id}`);
  return data;
}

export async function createScadenza(payload: ScadenzeCreateRequest): Promise<ScadenzeWithRelations> {
  const { data } = await client.post<ScadenzeWithRelations>('/v1/scadenze', payload);
  return data;
}

export async function updateScadenza(
  id: number,
  payload: ScadenzeUpdateRequest,
): Promise<ScadenzeWithRelations> {
  const { data } = await client.put<ScadenzeWithRelations>(`/v1/scadenze/${id}`, payload);
  return data;
}

export async function deleteScadenza(id: number, hard?: boolean): Promise<void> {
  const params: Record<string, string> = {};
  if (hard) params.hard = 'true';
  await client.delete(`/v1/scadenze/${id}`, { params });
}

export async function exportScadenzasPDF(filters?: ScadenzeFilters): Promise<Blob> {
  const params: Record<string, string | number> = {};
  if (filters?.cliente_id) params.cliente_id = filters.cliente_id;
  if (filters?.utente_id) params.utente_id = filters.utente_id;
  if (filters?.filter) params.filter = filters.filter;
  if (filters?.date_start) params.date_start = filters.date_start;
  if (filters?.date_end) params.date_end = filters.date_end;

  const response = await client.get('/v1/scadenze/export/pdf', {
    params,
    responseType: 'blob',
  });
  return response.data;
}
