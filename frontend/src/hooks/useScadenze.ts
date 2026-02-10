import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getScadenze,
  getScadenzaById,
  createScadenza,
  updateScadenza,
  deleteScadenza,
  exportScadenzasPDF,
  type ScadenzeFilters,
} from '../api/scadenze';
import type { ScadenzeCreateRequest, ScadenzeUpdateRequest } from '../../../shared';

export function useScadenze(filters?: ScadenzeFilters) {
  return useQuery({
    queryKey: ['scadenze', filters],
    queryFn: () => getScadenze(filters),
  });
}

export function useScadenza(id: number) {
  return useQuery({
    queryKey: ['scadenze', id],
    queryFn: () => getScadenzaById(id),
    enabled: id > 0,
  });
}

export function useCreateScadenza() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScadenzeCreateRequest) => createScadenza(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scadenze'] });
    },
  });
}

export function useUpdateScadenza() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScadenzeUpdateRequest }) =>
      updateScadenza(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scadenze'] });
      queryClient.invalidateQueries({ queryKey: ['scadenze', variables.id] });
    },
  });
}

export function useDeleteScadenza() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hard }: { id: number; hard?: boolean }) =>
      deleteScadenza(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scadenze'] });
    },
  });
}

export function useExportScadenzasPDF() {
  return useMutation({
    mutationFn: (filters?: ScadenzeFilters) => exportScadenzasPDF(filters),
  });
}
