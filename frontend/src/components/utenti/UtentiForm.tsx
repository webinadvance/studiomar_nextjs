import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import type { Utente, CreateUtenteData } from '../../api/utenti';
import { useCreateUtente, useUpdateUtente } from '../../hooks/useUtenti';

interface UtentiFormProps {
  open: boolean;
  onClose: () => void;
  utente: Utente | null;
}

interface FormValues {
  Nome: string;
  Cognome: string;
  Email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UtentiForm({ open, onClose, utente }: UtentiFormProps) {
  const createMutation = useCreateUtente();
  const updateMutation = useUpdateUtente();
  const isEdit = utente !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      Nome: '',
      Cognome: '',
      Email: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        Nome: utente?.Nome ?? '',
        Cognome: utente?.Cognome ?? '',
        Email: utente?.Email ?? '',
      });
    }
  }, [open, utente, reset]);

  const onSubmit = (values: FormValues) => {
    const payload: CreateUtenteData = {
      Nome: values.Nome || undefined,
      Cognome: values.Cognome || undefined,
      Email: values.Email || undefined,
    };

    const mutation = isEdit
      ? updateMutation.mutateAsync({ id: utente.Id, data: payload })
      : createMutation.mutateAsync(payload);

    mutation.then(() => {
      onClose();
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Modifica Utente' : 'Nuovo Utente'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome"
              fullWidth
              {...register('Nome')}
            />
            <TextField
              label="Cognome"
              fullWidth
              {...register('Cognome')}
            />
            <TextField
              label="Email"
              fullWidth
              {...register('Email', {
                validate: (value) =>
                  !value || EMAIL_REGEX.test(value) || 'Formato email non valido',
              })}
              error={!!errors.Email}
              helperText={errors.Email?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : null}
          >
            {isPending ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
