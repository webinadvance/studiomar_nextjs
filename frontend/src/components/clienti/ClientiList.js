import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, TextField, Button, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useClienti, useDeleteCliente } from '../../hooks/useClienti';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function ClientiList({ onEdit, onAdd }) {
    const [filter, setFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const debounceRef = useRef(null);
    const { data: clienti, isLoading, isError, error } = useClienti(debouncedFilter || undefined);
    const deleteMutation = useDeleteCliente();
    const handleFilterChange = useCallback((value) => {
        setFilter(value);
        if (debounceRef.current)
            clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedFilter(value);
        }, 300);
    }, []);
    useEffect(() => {
        return () => {
            if (debounceRef.current)
                clearTimeout(debounceRef.current);
        };
    }, []);
    const handleDeleteConfirm = async () => {
        if (!deleteTarget)
            return;
        try {
            await deleteMutation.mutateAsync({ id: deleteTarget.id });
        }
        finally {
            setDeleteTarget(null);
        }
    };
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const fullColumns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Nome', flex: 1, minWidth: 200 },
        {
            field: 'is_active',
            headerName: 'Attivo',
            width: 100,
            renderCell: (params) => params.value ? (_jsx(CheckCircleIcon, { color: "success" })) : (_jsx(CancelIcon, { color: "error" })),
        },
        {
            field: 'actions',
            headerName: 'Azioni',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Box, { children: [_jsx(IconButton, { size: "small", color: "primary", onClick: () => onEdit(params.row.id), "aria-label": "modifica", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(params.row), "aria-label": "elimina", children: _jsx(DeleteIcon, {}) })] })),
        },
    ];
    const smallColumns = [
        { field: 'name', headerName: 'Nome', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Azioni',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Box, { children: [_jsx(IconButton, { size: "small", color: "primary", onClick: () => onEdit(params.row.id), "aria-label": "modifica", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(params.row), "aria-label": "elimina", children: _jsx(DeleteIcon, {}) })] })),
        },
    ];
    const columns = isSmall ? smallColumns : fullColumns;
    if (isError) {
        return (_jsxs(Alert, { severity: "error", sx: { mb: 2 }, children: ["Errore nel caricamento dei clienti: ", error?.message ?? 'Errore sconosciuto'] }));
    }
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }, children: [_jsx(TextField, { label: "Cerca clienti", variant: "outlined", size: "small", value: filter, onChange: (e) => handleFilterChange(e.target.value), fullWidth: true, sx: { flexGrow: 1, maxWidth: { xs: '100%', sm: 400 } } }), _jsx(Button, { variant: "contained", onClick: onAdd, children: "Nuovo Cliente" })] }), isLoading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsx(DataGrid, { rows: clienti ?? [], columns: columns, pageSizeOptions: [10, 25, 50], initialState: {
                    pagination: { paginationModel: { pageSize: 10 } },
                }, autoHeight: true, disableRowSelectionOnClick: true, sx: {
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                } })), _jsxs(Dialog, { open: !!deleteTarget, onClose: () => setDeleteTarget(null), children: [_jsx(DialogTitle, { children: "Conferma eliminazione" }), _jsx(DialogContent, { children: _jsxs(DialogContentText, { children: ["Sei sicuro di voler eliminare il cliente \"", deleteTarget?.name, "\"?"] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDeleteTarget(null), disabled: deleteMutation.isPending, children: "Annulla" }), _jsx(Button, { onClick: handleDeleteConfirm, color: "error", variant: "contained", disabled: deleteMutation.isPending, children: deleteMutation.isPending ? _jsx(CircularProgress, { size: 20 }) : 'Elimina' })] })] })] }));
}
