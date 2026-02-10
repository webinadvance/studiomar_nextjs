import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScadenze, getScadenzaById, createScadenza, updateScadenza, deleteScadenza, exportScadenzasPDF, } from '../api/scadenze';
export function useScadenze(filters) {
    return useQuery({
        queryKey: ['scadenze', filters],
        queryFn: () => getScadenze(filters),
    });
}
export function useScadenza(id) {
    return useQuery({
        queryKey: ['scadenze', id],
        queryFn: () => getScadenzaById(id),
        enabled: id > 0,
    });
}
export function useCreateScadenza() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createScadenza(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scadenze'] });
        },
    });
}
export function useUpdateScadenza() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateScadenza(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['scadenze'] });
            queryClient.invalidateQueries({ queryKey: ['scadenze', variables.id] });
        },
    });
}
export function useDeleteScadenza() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, hard }) => deleteScadenza(id, hard),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scadenze'] });
        },
    });
}
export function useExportScadenzasPDF() {
    return useMutation({
        mutationFn: (filters) => exportScadenzasPDF(filters),
    });
}
