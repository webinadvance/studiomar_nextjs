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
  Alert,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { useCreateScadenza, useUpdateScadenza } from '../../hooks/useScadenze';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
import { recurrenceOptions } from '../../utils/formatRecurrence';
import type { ScadenzeWithRelations, Utente, Cliente } from '../../../../shared';

interface ScadenzeFormProps {
  open: boolean;
  onClose: () => void;
  scadenza: ScadenzeWithRelations | null;
}

interface FormValues {
  name: string;
  rec?: number;
  date?: Date | null;
  utente_ids: Utente[];
  cliente_ids: Cliente[];
}

export default function ScadenzeForm({ open, onClose, scadenza }: ScadenzeFormProps) {
  const createMutation = useCreateScadenza();
  const updateMutation = useUpdateScadenza();
  const { data: utenti = [] } = useUtenti();
  const { data: clienti = [] } = useClienti();

  const isEdit = scadenza !== null;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      rec: undefined,
      date: null,
      utente_ids: [],
      cliente_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && scadenza) {
        const selectedUtenti = scadenza.scadenze_utenti
          ? utenti.filter((u) => scadenza.scadenze_utenti?.some((su) => su.utente_id === u.id))
          : [];
        const selectedClienti = scadenza.scadenze_clienti
          ? clienti.filter((c) => scadenza.scadenze_clienti?.some((sc) => sc.cliente_id === c.id))
          : [];

        reset({
          name: scadenza.name,
          rec: scadenza.rec || undefined,
          date: scadenza.date ? parseISO(scadenza.date) : null,
          utente_ids: selectedUtenti,
          cliente_ids: selectedClienti,
        });
      } else {
        reset({
          name: '',
          rec: undefined,
          date: null,
          utente_ids: [],
          cliente_ids: [],
        });
      }
    }
  }, [open, isEdit, scadenza, utenti, clienti, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      rec: values.rec ?? 0,
      date: values.date ? values.date.toISOString().split('T')[0] : undefined,
      utente_ids: values.utente_ids.map((u) => u.id),
      cliente_ids: values.cliente_ids.map((c) => c.id),
    };

    const mutation = isEdit && scadenza
      ? updateMutation.mutateAsync({ id: scadenza.id, data: payload })
      : createMutation.mutateAsync(payload);

    mutation.then(() => {
      onClose();
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Modifica Scadenza' : 'Nuova Scadenza'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {error && (
                <Alert severity="error">
                  {(error as Error).message || 'Errore durante il salvataggio'}
                </Alert>
              )}

              <TextField
                label="Nome"
                fullWidth
                {...register('name', { required: 'Nome è obbligatorio' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <FormControl fullWidth>
                <InputLabel>Ricorrenza</InputLabel>
                <Select
                  label="Ricorrenza"
                  {...register('rec', { valueAsNumber: true })}
                  defaultValue={0}
                >
                  {recurrenceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />

              <Controller
                name="utente_ids"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={utenti}
                    getOptionLabel={(o) => [o.nome, o.cognome].filter(Boolean).join(' ') || `#${o.id}`}
                    value={field.value}
                    onChange={(_e, v) => field.onChange(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={[option.nome, option.cognome].filter(Boolean).join(' ') || `#${option.id}`}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Utenti" fullWidth />}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  />
                )}
              />

              <Controller
                name="cliente_ids"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={clienti}
                    getOptionLabel={(o) => o.name || `#${o.id}`}
                    value={field.value}
                    onChange={(_e, v) => field.onChange(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.name || `#${option.id}`}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Clienti" fullWidth />}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  />
                )}
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
    </LocalizationProvider>
  );
}
