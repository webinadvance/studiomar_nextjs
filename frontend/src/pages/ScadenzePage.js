import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ScadenzeFilters from '../components/scadenze/ScadenzeFilters';
import ScadenzeList from '../components/scadenze/ScadenzeList';
import ScadenzeForm from '../components/scadenze/ScadenzeForm';
import { useScadenza, useExportScadenzasPDF } from '../hooks/useScadenze';
export default function ScadenzePage() {
    const [filters, setFilters] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const { data: editingScadenza } = useScadenza(editingId ?? 0);
    const exportMutation = useExportScadenzasPDF();
    const handleCreate = useCallback(() => {
        setEditingId(null);
        setFormOpen(true);
    }, []);
    const handleEdit = useCallback((id) => {
        setEditingId(id);
        setFormOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setFormOpen(false);
        setEditingId(null);
    }, []);
    const handleExportPDF = useCallback(async () => {
        try {
            const blob = await exportMutation.mutateAsync(filters);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `scadenze_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('PDF export failed:', error);
        }
    }, [filters, exportMutation]);
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }, children: [_jsx(Typography, { variant: "h4", children: "Scadenze" }), _jsxs(Box, { sx: { display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), onClick: handleExportPDF, disabled: exportMutation.isPending, children: exportMutation.isPending ? 'Esportazione...' : 'Esporta PDF' }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleCreate, children: "Nuova Scadenza" })] })] }), _jsx(ScadenzeFilters, { onChange: setFilters }), _jsx(ScadenzeList, { filters: filters, onEdit: handleEdit }), _jsx(ScadenzeForm, { open: formOpen, onClose: handleClose, scadenza: editingScadenza ?? null })] }));
}
