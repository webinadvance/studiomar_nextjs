import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/common/PageHeader';
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
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Clienti", subtitle: "Manage your client database.", action: _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleAdd, children: "Nuovo Cliente" }) }), _jsx(Paper, { sx: { p: 3, borderRadius: 3 }, elevation: 0, children: _jsx(ClientiList, { onEdit: handleEdit }) }), _jsx(ClientiForm, { open: formOpen, onClose: handleClose, editId: editId })] }));
}
