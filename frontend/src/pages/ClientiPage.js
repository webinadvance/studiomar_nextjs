import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ClientiList from '../components/clienti/ClientiList';
import ClientiForm from '../components/clienti/ClientiForm';
export default function ClientiPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const handleAdd = useCallback(() => {
        setEditId(null);
        setFormOpen(true);
    }, []);
    const handleEdit = useCallback((id) => {
        setEditId(id);
        setFormOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setFormOpen(false);
        setEditId(null);
    }, []);
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Clienti" }), _jsx(ClientiList, { onEdit: handleEdit, onAdd: handleAdd }), _jsx(ClientiForm, { open: formOpen, onClose: handleClose, editId: editId })] }));
}
