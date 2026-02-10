import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, Alert, Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { useCreateScadenza, useUpdateScadenza } from '../../hooks/useScadenze';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
import { recurrenceOptions } from '../../utils/formatRecurrence';
export default function ScadenzeForm({ open, onClose, scadenza }) {
    const createMutation = useCreateScadenza();
    const updateMutation = useUpdateScadenza();
    const { data: utenti = [] } = useUtenti();
    const { data: clienti = [] } = useClienti();
    const isEdit = scadenza !== null;
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({
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
            }
            else {
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
    const onSubmit = (values) => {
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
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: isEdit ? 'Modifica Scadenza' : 'Nuova Scadenza' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }, children: [error && (_jsx(Alert, { severity: "error", children: error.message || 'Errore durante il salvataggio' })), _jsx(TextField, { label: "Nome", fullWidth: true, ...register('name', { required: 'Nome è obbligatorio' }), error: !!errors.name, helperText: errors.name?.message }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Ricorrenza" }), _jsx(Select, { label: "Ricorrenza", ...register('rec', { valueAsNumber: true }), defaultValue: 0, children: recurrenceOptions.map((option) => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) })] }), _jsx(Controller, { name: "date", control: control, render: ({ field }) => (_jsx(DatePicker, { label: "Data", value: field.value, onChange: field.onChange, slotProps: { textField: { fullWidth: true } } })) }), _jsx(Controller, { name: "utente_ids", control: control, render: ({ field }) => (_jsx(Autocomplete, { multiple: true, options: utenti, getOptionLabel: (o) => [o.nome, o.cognome].filter(Boolean).join(' ') || `#${o.id}`, value: field.value, onChange: (_e, v) => field.onChange(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: [option.nome, option.cognome].filter(Boolean).join(' ') || `#${option.id}`, size: "small", ...getTagProps({ index }), key: option.id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Utenti", fullWidth: true }), isOptionEqualToValue: (opt, val) => opt.id === val.id })) }), _jsx(Controller, { name: "cliente_ids", control: control, render: ({ field }) => (_jsx(Autocomplete, { multiple: true, options: clienti, getOptionLabel: (o) => o.name || `#${o.id}`, value: field.value, onChange: (_e, v) => field.onChange(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: option.name || `#${option.id}`, size: "small", ...getTagProps({ index }), key: option.id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Clienti", fullWidth: true }), isOptionEqualToValue: (opt, val) => opt.id === val.id })) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: isPending, children: "Annulla" }), _jsx(Button, { type: "submit", variant: "contained", disabled: isPending, startIcon: isPending ? _jsx(CircularProgress, { size: 16 }) : null, children: isPending ? 'Salvataggio...' : 'Salva' })] })] })] }) }));
}
