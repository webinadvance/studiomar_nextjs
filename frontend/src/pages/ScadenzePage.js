import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ScadenzeFilters from '../components/scadenze/ScadenzeFilters';
import ScadenzeList from '../components/scadenze/ScadenzeList';
import ScadenzeForm from '../components/scadenze/ScadenzeForm';
import PageHeader from '../components/common/PageHeader';
import { useScadenza, useExportScadenzasPDF } from '../hooks/useScadenze';
export default function ScadenzePage() {
    const [filters, setFilters] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const { data: editingScadenza, isLoading: isScadenzaLoading } = useScadenza(editingId ?? 0);
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
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Scadenze", subtitle: "Gestisci le scadenze imminenti e gli eventi.", action: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(FileDownloadIcon, {}), onClick: handleExportPDF, disabled: exportMutation.isPending, children: exportMutation.isPending ? 'Esportazione...' : 'Esporta PDF' }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleCreate, children: "Nuova Scadenza" })] }) }), _jsx(Paper, { sx: { p: 3, mb: 4, borderRadius: 3 }, elevation: 0, children: _jsx(ScadenzeFilters, { onChange: setFilters }) }), _jsx(Paper, { sx: { p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }, elevation: 0, children: _jsx(ScadenzeList, { filters: filters, onEdit: handleEdit }) }), _jsx(ScadenzeForm, { open: formOpen, onClose: handleClose, scadenza: editingScadenza, isLoading: isScadenzaLoading })] }));
}
