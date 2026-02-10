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
  Name: string;
  Rec?: number;
  Date?: Date | null;
  UtenteIds: Utente[];
  ClienteIds: Cliente[];
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
      Name: '',
      Rec: undefined,
      Date: null,
      UtenteIds: [],
      ClienteIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && scadenza) {
        const selectedUtenti = scadenza.ScadenzeUtenti
          ? utenti.filter((u) => scadenza.ScadenzeUtenti?.some((su) => su.UtenteId === u.Id))
          : [];
        const selectedClienti = scadenza.ScadenzeClienti
          ? clienti.filter((c) => scadenza.ScadenzeClienti?.some((sc) => sc.ClienteId === c.Id))
          : [];

        reset({
          Name: scadenza.Name,
          Rec: scadenza.Rec || undefined,
          Date: scadenza.Date ? parseISO(scadenza.Date) : null,
          UtenteIds: selectedUtenti,
          ClienteIds: selectedClienti,
        });
      } else {
        reset({
          Name: '',
          Rec: undefined,
          Date: null,
          UtenteIds: [],
          ClienteIds: [],
        });
      }
    }
  }, [open, isEdit, scadenza, utenti, clienti, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      Name: values.Name,
      Rec: values.Rec ?? 0,
      Date: values.Date ? values.Date.toISOString().split('T')[0] : undefined,
      UtenteIds: values.UtenteIds.map((u) => u.Id),
      ClienteIds: values.ClienteIds.map((c) => c.Id),
    };

    const mutation = isEdit && scadenza
      ? updateMutation.mutateAsync({ id: scadenza.Id, data: payload })
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
                {...register('Name', { required: 'Nome è obbligatorio' })}
                error={!!errors.Name}
                helperText={errors.Name?.message}
              />

              <FormControl fullWidth>
                <InputLabel>Ricorrenza</InputLabel>
                <Select
                  label="Ricorrenza"
                  {...register('Rec', { valueAsNumber: true })}
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
                name="Date"
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
                name="UtenteIds"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={utenti}
                    getOptionLabel={(o) => [o.Nome, o.Cognome].filter(Boolean).join(' ') || `#${o.Id}`}
                    value={field.value}
                    onChange={(_e, v) => field.onChange(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={[option.Nome, option.Cognome].filter(Boolean).join(' ') || `#${option.Id}`}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.Id}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Utenti" fullWidth />}
                    isOptionEqualToValue={(opt, val) => opt.Id === val.Id}
                  />
                )}
              />

              <Controller
                name="ClienteIds"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={clienti}
                    getOptionLabel={(o) => o.Name || `#${o.Id}`}
                    value={field.value}
                    onChange={(_e, v) => field.onChange(v)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.Name || `#${option.Id}`}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.Id}
                        />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Clienti" fullWidth />}
                    isOptionEqualToValue={(opt, val) => opt.Id === val.Id}
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
