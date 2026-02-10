import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, Alert, Autocomplete, Chip, } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateScadenza, useUpdateScadenza } from '../../hooks/useScadenze';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
export default function ScadenzeForm({ open, onClose, scadenza, isLoading: isScadenzaLoading = false }) {
    const createMutation = useCreateScadenza();
    const updateMutation = useUpdateScadenza();
    const { data: utenti = [], isLoading: isUtentiLoading } = useUtenti();
    const { data: clienti = [], isLoading: isClientiLoading } = useClienti();
    const isEdit = scadenza !== undefined && scadenza !== null;
    const isDataLoading = isScadenzaLoading || isUtentiLoading || isClientiLoading;
    const { register, handleSubmit, reset, control, formState: { errors }, } = useForm({
        defaultValues: {
            Name: '',
            Rec: undefined,
            Date: null,
            ScadenzaReale: null,
            UtenteIds: [],
            ClienteIds: [],
        },
    });
    useEffect(() => {
        if (!open)
            return;
        if (isEdit && scadenza) {
            if (isDataLoading)
                return;
            const selectedUtenti = scadenza.ScadenzeUtenti
                ? utenti.filter((u) => scadenza.ScadenzeUtenti?.some((su) => su.UtenteId === u.Id))
                : [];
            const selectedClienti = scadenza.ScadenzeClienti
                ? clienti.filter((c) => scadenza.ScadenzeClienti?.some((sc) => sc.ClienteId === c.Id))
                : [];
            reset({
                Name: scadenza.Name,
                Rec: scadenza.Rec || undefined,
                Date: scadenza.Date,
                ScadenzaReale: scadenza.ScadenzaReale,
                UtenteIds: selectedUtenti,
                ClienteIds: selectedClienti,
            });
        }
        else {
            reset({
                Name: '',
                Rec: undefined,
                Date: null,
                ScadenzaReale: null,
                UtenteIds: [],
                ClienteIds: [],
            });
        }
    }, [open, isEdit, scadenza, utenti, clienti, reset, isDataLoading]);
    const onSubmit = (values) => {
        const payload = {
            Name: values.Name,
            Rec: values.Rec ?? 0,
            Date: values.Date || undefined,
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
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: isEdit ? 'Modifica Scadenza' : 'Nuova Scadenza' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }, children: [error && (_jsx(Alert, { severity: "error", children: error.message || 'Errore durante il salvataggio' })), isDataLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(TextField, { label: "Nome", fullWidth: true, ...register('Name', { required: 'Nome è obbligatorio' }), error: !!errors.Name, helperText: errors.Name?.message }), _jsx(TextField, { label: "Ricorrenza (mesi)", type: "number", fullWidth: true, ...register('Rec', { valueAsNumber: true }), error: !!errors.Rec, helperText: errors.Rec?.message }), _jsx(Controller, { name: "UtenteIds", control: control, render: ({ field }) => (_jsx(Autocomplete, { multiple: true, options: utenti, getOptionLabel: (o) => [o.Nome, o.Cognome].filter(Boolean).join(' ') || `#${o.Id}`, value: field.value, onChange: (_e, v) => field.onChange(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: [option.Nome, option.Cognome].filter(Boolean).join(' ') || `#${option.Id}`, size: "small", ...getTagProps({ index }), key: option.Id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Utenti", fullWidth: true }), isOptionEqualToValue: (opt, val) => opt.Id === val.Id })) }), _jsx(Controller, { name: "ClienteIds", control: control, render: ({ field }) => (_jsx(Autocomplete, { multiple: true, options: clienti, getOptionLabel: (o) => o.Name || `#${o.Id}`, value: field.value, onChange: (_e, v) => field.onChange(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: option.Name || `#${option.Id}`, size: "small", ...getTagProps({ index }), key: option.Id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Clienti", fullWidth: true }), isOptionEqualToValue: (opt, val) => opt.Id === val.Id })) })] }))] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: isPending, children: "Annulla" }), _jsx(Button, { type: "submit", variant: "contained", disabled: isPending, startIcon: isPending ? _jsx(CircularProgress, { size: 16 }) : null, children: isPending ? 'Salvataggio...' : 'Salva' })] })] })] }) }));
}
