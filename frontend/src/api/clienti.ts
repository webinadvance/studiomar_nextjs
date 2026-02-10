import client from './client';
import type { Cliente } from '../../../shared';

export async function getClienti(filter?: string): Promise<Cliente[]> {
  const params: Record<string, string> = {};
  if (filter) params.filter = filter;
  const { data } = await client.get<{ data: Cliente[] }>('/v1/clienti', { params });
  return data.data;
}

export async function getClienteById(id: number): Promise<Cliente> {
  const { data } = await client.get<{ data: Cliente }>(`/v1/clienti/${id}`);
  return data.data;
}

export async function createCliente(payload: { name: string }): Promise<Cliente> {
  const { data } = await client.post<{ data: Cliente }>('/v1/clienti', payload);
  return data.data;
}

export async function updateCliente(id: number, payload: { name: string }): Promise<Cliente> {
  const { data } = await client.put<{ data: Cliente }>(`/v1/clienti/${id}`, payload);
  return data.data;
}

export async function deleteCliente(id: number, hard?: boolean): Promise<void> {
  const params: Record<string, string> = {};
  if (hard) params.hard = 'true';
  await client.delete(`/v1/clienti/${id}`, { params });
}

export async function getClientiMin(): Promise<Array<{ id: number; name: string }>> {
  const { data } = await client.get<{ data: Array<{ id: number; name: string }> }>('/v1/clienti/min');
  return data.data;
}
