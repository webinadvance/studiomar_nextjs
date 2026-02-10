import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUtenti, useDeleteUtente } from '../../hooks/useUtenti';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function UtentiList({ onEdit }) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const timerRef = useRef();
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timerRef.current);
    }, [search]);
    const { data: utenti, isLoading, isError, error } = useUtenti(debouncedSearch || undefined);
    const deleteMutation = useDeleteUtente();
    const handleDelete = useCallback((id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
            deleteMutation.mutate({ id });
        }
    }, [deleteMutation]);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const fullColumns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 150, valueGetter: (_value, row) => row.nome ?? '' },
        { field: 'cognome', headerName: 'Cognome', flex: 1, minWidth: 150, valueGetter: (_value, row) => row.cognome ?? '' },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200, valueGetter: (_value, row) => row.email ?? '' },
        {
            field: 'actions',
            headerName: 'Azioni',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Box, { children: [_jsx(IconButton, { size: "small", onClick: () => onEdit(params.row), children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDelete(params.row.id), children: _jsx(DeleteIcon, { fontSize: "small" }) })] })),
        },
    ], [onEdit, handleDelete]);
    const smallColumns = [
        { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 150, valueGetter: (_value, row) => row.nome ?? '' },
        { field: 'cognome', headerName: 'Cognome', flex: 1, minWidth: 150, valueGetter: (_value, row) => row.cognome ?? '' },
        {
            field: 'actions',
            headerName: 'Azioni',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Box, { children: [_jsx(IconButton, { size: "small", onClick: () => onEdit(params.row), children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDelete(params.row.id), children: _jsx(DeleteIcon, { fontSize: "small" }) })] })),
        },
    ];
    const columns = isSmall ? smallColumns : fullColumns;
    if (isError) {
        return (_jsxs(Alert, { severity: "error", children: ["Errore nel caricamento degli utenti: ", error.message] }));
    }
    return (_jsxs(Box, { children: [_jsx(TextField, { label: "Cerca utenti", variant: "outlined", size: "small", fullWidth: true, value: search, onChange: (e) => setSearch(e.target.value), sx: { mb: 2 } }), isLoading ? (_jsxs(Box, { sx: { display: 'flex', justifyContent: 'center', py: 4 }, children: [_jsx(CircularProgress, {}), _jsx(Typography, { sx: { ml: 2 }, children: "Caricamento..." })] })) : (_jsx(DataGrid, { rows: utenti ?? [], columns: columns, autoHeight: true, pageSizeOptions: [10, 25, 50], initialState: {
                    pagination: { paginationModel: { pageSize: 10 } },
                }, disableRowSelectionOnClick: true }))] }));
}
