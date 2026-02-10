import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUtenti,
  getUtenteById,
  createUtente,
  updateUtente,
  deleteUtente,
  getUtentiMin,
} from '../api/utenti';

export function useUtenti(filter?: string) {
  return useQuery({
    queryKey: ['utenti', filter],
    queryFn: () => getUtenti(filter),
  });
}

export function useUtente(id: number) {
  return useQuery({
    queryKey: ['utenti', id],
    queryFn: () => getUtenteById(id),
    enabled: id > 0,
  });
}

export function useCreateUtente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { nome?: string; cognome?: string; email?: string }) =>
      createUtente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utenti'] });
    },
  });
}

export function useUpdateUtente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { nome?: string; cognome?: string; email?: string };
    }) => updateUtente(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['utenti'] });
      queryClient.invalidateQueries({ queryKey: ['utenti', variables.id] });
    },
  });
}

export function useDeleteUtente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hard }: { id: number; hard?: boolean }) =>
      deleteUtente(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utenti'] });
    },
  });
}

export function useUtentiMin() {
  return useQuery({
    queryKey: ['utenti', 'min'],
    queryFn: () => getUtentiMin(),
  });
}
