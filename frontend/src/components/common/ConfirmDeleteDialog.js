import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, } from '@mui/material';
export default function ConfirmDeleteDialog({ open, title = 'Confermare eliminazione', message = 'Sei sicuro di voler eliminare questo elemento?', loading = false, onConfirm, onCancel, }) {
    return (_jsxs(Dialog, { open: open, onClose: onCancel, children: [_jsx(DialogTitle, { children: title }), _jsx(DialogContent, { children: message }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onCancel, disabled: loading, children: "Annulla" }), _jsx(Button, { onClick: onConfirm, variant: "contained", color: "error", disabled: loading, startIcon: loading ? _jsx(CircularProgress, { size: 16 }) : null, children: loading ? 'Eliminazione...' : 'Elimina' })] })] }));
}
