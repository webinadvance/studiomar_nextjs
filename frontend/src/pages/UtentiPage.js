import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/common/PageHeader';
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
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Utenti", subtitle: "Manage system users and permissions.", action: _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleCreate, children: "Nuovo Utente" }) }), _jsx(Paper, { sx: { p: 3, borderRadius: 3 }, elevation: 0, children: _jsx(UtentiList, { onEdit: handleEdit }) }), _jsx(UtentiForm, { open: formOpen, onClose: handleClose, utente: editingUtente })] }));
}
