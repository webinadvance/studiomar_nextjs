import client from './client';
import type { Cliente } from '../../../shared';

export async function getClienti(filter?: string): Promise<Cliente[]> {
  const params: Record<string, string> = {};
  if (filter) params.filter = filter;
  const { data } = await client.get<Cliente[]>('/v1/clienti', { params });
  return data;
}

export async function getClienteById(id: number): Promise<Cliente> {
  const { data } = await client.get<Cliente>(`/v1/clienti/${id}`);
  return data;
}

export async function createCliente(payload: { Name: string }): Promise<Cliente> {
  const { data } = await client.post<Cliente>('/v1/clienti', payload);
  return data;
}

export async function updateCliente(id: number, payload: { Name: string }): Promise<Cliente> {
  const { data } = await client.put<Cliente>(`/v1/clienti/${id}`, payload);
  return data;
}

export async function deleteCliente(id: number, hard?: boolean): Promise<void> {
  const params: Record<string, string> = {};
  if (hard) params.hard = 'true';
  await client.delete(`/v1/clienti/${id}`, { params });
}

export async function getClientiMin(): Promise<Array<{ Id: number; Name: string }>> {
  const { data } = await client.get<Array<{ Id: number; Name: string }>>('/v1/clienti/min');
  return data;
}
