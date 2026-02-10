import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCliente, useCreateCliente, useUpdateCliente } from '../../hooks/useClienti';

interface ClientiFormProps {
  open: boolean;
  onClose: () => void;
  editId?: number | null;
}

interface FormValues {
  name: string;
}

export default function ClientiForm({ open, onClose, editId }: ClientiFormProps) {
  const isEditing = !!editId && editId > 0;
  const { data: cliente, isLoading: isLoadingCliente } = useCliente(editId ?? 0);

  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '' },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && cliente) {
      reset({ name: cliente.name });
    } else if (!isEditing) {
      reset({ name: '' });
    }
  }, [isEditing, cliente, reset]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset({ name: '' });
      createMutation.reset();
      updateMutation.reset();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && editId) {
        await updateMutation.mutateAsync({ id: editId, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose();
    } catch {
      // Error is handled by mutation state
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEditing ? 'Modifica Cliente' : 'Nuovo Cliente'}</DialogTitle>
        <DialogContent>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(mutationError as Error)?.message ?? 'Errore durante il salvataggio'}
            </Alert>
          )}

          {isEditing && isLoadingCliente ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              fullWidth
              variant="outlined"
              {...register('name', { required: 'Il nome è obbligatorio' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isPending}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || (isEditing && isLoadingCliente)}
          >
            {isPending ? <CircularProgress size={20} /> : 'Salva'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
