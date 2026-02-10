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
  nome: string;
  cognome: string;
  email: string;
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
      nome: '',
      cognome: '',
      email: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: utente?.nome ?? '',
        cognome: utente?.cognome ?? '',
        email: utente?.email ?? '',
      });
    }
  }, [open, utente, reset]);

  const onSubmit = (values: FormValues) => {
    const payload: CreateUtenteData = {
      nome: values.nome || undefined,
      cognome: values.cognome || undefined,
      email: values.email || undefined,
    };

    const mutation = isEdit
      ? updateMutation.mutateAsync({ id: utente.id, data: payload })
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
              {...register('nome')}
            />
            <TextField
              label="Cognome"
              fullWidth
              {...register('cognome')}
            />
            <TextField
              label="Email"
              fullWidth
              {...register('email', {
                validate: (value) =>
                  !value || EMAIL_REGEX.test(value) || 'Formato email non valido',
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
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
