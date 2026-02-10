import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Box, } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCliente, useCreateCliente, useUpdateCliente } from '../../hooks/useClienti';
export default function ClientiForm({ open, onClose, editId }) {
    const isEditing = !!editId && editId > 0;
    const { data: cliente, isLoading: isLoadingCliente } = useCliente(editId ?? 0);
    const createMutation = useCreateCliente();
    const updateMutation = useUpdateCliente();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        defaultValues: { name: '' },
    });
    // Pre-fill form when editing
    useEffect(() => {
        if (isEditing && cliente) {
            reset({ name: cliente.name });
        }
        else if (!isEditing) {
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
    const onSubmit = async (values) => {
        try {
            if (isEditing && editId) {
                await updateMutation.mutateAsync({ id: editId, data: values });
            }
            else {
                await createMutation.mutateAsync(values);
            }
            onClose();
        }
        catch {
            // Error is handled by mutation state
        }
    };
    const isPending = createMutation.isPending || updateMutation.isPending;
    const mutationError = createMutation.error || updateMutation.error;
    return (_jsx(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(DialogTitle, { children: isEditing ? 'Modifica Cliente' : 'Nuovo Cliente' }), _jsxs(DialogContent, { children: [mutationError && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: mutationError?.message ?? 'Errore durante il salvataggio' })), isEditing && isLoadingCliente ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 3 }, children: _jsx(CircularProgress, {}) })) : (_jsx(TextField, { autoFocus: true, margin: "dense", label: "Nome", fullWidth: true, variant: "outlined", ...register('name', { required: 'Il nome è obbligatorio' }), error: !!errors.name, helperText: errors.name?.message, disabled: isPending }))] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, disabled: isPending, children: "Annulla" }), _jsx(Button, { type: "submit", variant: "contained", disabled: isPending || (isEditing && isLoadingCliente), children: isPending ? _jsx(CircularProgress, { size: 20 }) : 'Salva' })] })] }) }));
}
