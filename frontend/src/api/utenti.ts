import client from './client';
import type { Utente } from '../../../shared';

export type { Utente };
export type CreateUtenteData = { nome?: string; cognome?: string; email?: string };

export async function getUtenti(filter?: string): Promise<Utente[]> {
  const params: Record<string, string> = {};
  if (filter) params.filter = filter;
  const { data } = await client.get<{ data: Utente[] }>('/v1/utenti', { params });
  return data.data;
}

export async function getUtenteById(id: number): Promise<Utente> {
  const { data } = await client.get<{ data: Utente }>(`/v1/utenti/${id}`);
  return data.data;
}

export async function createUtente(payload: { nome?: string; cognome?: string; email?: string }): Promise<Utente> {
  const { data } = await client.post<{ data: Utente }>('/v1/utenti', payload);
  return data.data;
}

export async function updateUtente(id: number, payload: { nome?: string; cognome?: string; email?: string }): Promise<Utente> {
  const { data } = await client.put<{ data: Utente }>(`/v1/utenti/${id}`, payload);
  return data.data;
}

export async function deleteUtente(id: number, hard?: boolean): Promise<void> {
  const params: Record<string, string> = {};
  if (hard) params.hard = 'true';
  await client.delete(`/v1/utenti/${id}`, { params });
}

export async function getUtentiMin(): Promise<Array<{ id: number; cognome: string | null; nome: string | null }>> {
  const { data } = await client.get<{ data: Array<{ id: number; cognome: string | null; nome: string | null }> }>('/v1/utenti/min');
  return data.data;
}
