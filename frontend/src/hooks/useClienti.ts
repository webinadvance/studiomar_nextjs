import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClienti,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClientiMin,
} from '../api/clienti';

export function useClienti(filter?: string) {
  return useQuery({
    queryKey: ['clienti', filter],
    queryFn: () => getClienti(filter),
    staleTime: 5 * 60 * 1000, // 5 min - clienti rarely change
  });
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: ['clienti', id],
    queryFn: () => getClienteById(id),
    enabled: id > 0,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { Name: string }) => createCliente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { Name: string } }) =>
      updateCliente(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
      queryClient.invalidateQueries({ queryKey: ['clienti', variables.id] });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hard }: { id: number; hard?: boolean }) =>
      deleteCliente(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });
}

export function useClientiMin() {
  return useQuery({
    queryKey: ['clienti', 'min'],
    queryFn: () => getClientiMin(),
  });
}
