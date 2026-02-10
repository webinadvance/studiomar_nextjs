import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UtentiList from '../components/utenti/UtentiList';
import UtentiForm from '../components/utenti/UtentiForm';
export default function UtentiPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editingUtente, setEditingUtente] = useState(null);
    const handleEdit = useCallback((utente) => {
        setEditingUtente(utente);
        setFormOpen(true);
    }, []);
    const handleCreate = useCallback(() => {
        setEditingUtente(null);
        setFormOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setFormOpen(false);
        setEditingUtente(null);
    }, []);
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }, children: [_jsx(Typography, { variant: "h4", children: "Utenti" }), _jsx(Box, { sx: { width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }, children: _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleCreate, children: "Nuovo Utente" }) })] }), _jsx(UtentiList, { onEdit: handleEdit }), _jsx(UtentiForm, { open: formOpen, onClose: handleClose, utente: editingUtente })] }));
}
