import client from './client';
import type { Utente } from '../../../shared';

export type { Utente };
export type CreateUtenteData = { Nome?: string; Cognome?: string; Email?: string };

export async function getUtenti(filter?: string): Promise<Utente[]> {
  const params: Record<string, string> = {};
  if (filter) params.filter = filter;
  const { data } = await client.get<Utente[]>('/v1/utenti', { params });
  return data;
}

export async function getUtenteById(id: number): Promise<Utente> {
  const { data } = await client.get<Utente>(`/v1/utenti/${id}`);
  return data;
}

export async function createUtente(payload: { Nome?: string; Cognome?: string; Email?: string }): Promise<Utente> {
  const { data } = await client.post<Utente>('/v1/utenti', payload);
  return data;
}

export async function updateUtente(id: number, payload: { Nome?: string; Cognome?: string; Email?: string }): Promise<Utente> {
  const { data } = await client.put<Utente>(`/v1/utenti/${id}`, payload);
  return data;
}

export async function deleteUtente(id: number, hard?: boolean): Promise<void> {
  const params: Record<string, string> = {};
  if (hard) params.hard = 'true';
  await client.delete(`/v1/utenti/${id}`, { params });
}

export async function getUtentiMin(): Promise<Array<{ Id: number; Cognome: string | null; Nome: string | null }>> {
  const { data } = await client.get<Array<{ Id: number; Cognome: string | null; Nome: string | null }>>('/v1/utenti/min');
  return data;
}
