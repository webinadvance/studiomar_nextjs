import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCreateUtente, useUpdateUtente } from '../../hooks/useUtenti';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function UtentiForm({ open, onClose, utente }) {
    const createMutation = useCreateUtente();
    const updateMutation = useUpdateUtente();
    const isEdit = utente !== null;
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
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
    const onSubmit = (values) => {
        const payload = {
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
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: isEdit ? 'Modifica Utente' : 'Nuovo Utente' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(DialogContent, { children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }, children: [_jsx(TextField, { label: "Nome", fullWidth: true, ...register('Nome') }), _jsx(TextField, { label: "Cognome", fullWidth: true, ...register('Cognome') }), _jsx(TextField, { label: "Email", fullWidth: true, ...register('Email', {
                                        validate: (value) => !value || EMAIL_REGEX.test(value) || 'Formato email non valido',
                                    }), error: !!errors.Email, helperText: errors.Email?.message })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: isPending, children: "Annulla" }), _jsx(Button, { type: "submit", variant: "contained", disabled: isPending, startIcon: isPending ? _jsx(CircularProgress, { size: 16 }) : null, children: isPending ? 'Salvataggio...' : 'Salva' })] })] })] }));
}
