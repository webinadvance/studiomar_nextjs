import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Box, IconButton, Chip, Stack, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';
import { useScadenze, useDeleteScadenza } from '../../hooks/useScadenze';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
function formatDate(iso) {
    if (!iso)
        return '—';
    try {
        return format(parseISO(iso), 'dd/MM/yyyy');
    }
    catch {
        return iso;
    }
}
export default function ScadenzeList({ filters, onEdit }) {
    const apiFilters = useMemo(() => {
        const f = {};
        if (filters.filter)
            f.filter = filters.filter;
        if (filters.date_start)
            f.date_start = filters.date_start;
        if (filters.date_end)
            f.date_end = filters.date_end;
        // For multi-select, use the first id only (API supports single id)
        if (filters.utente_ids?.length)
            f.utente_id = filters.utente_ids[0];
        if (filters.cliente_ids?.length)
            f.cliente_id = filters.cliente_ids[0];
        return f;
    }, [filters]);
    const { data: scadenze = [], isLoading, isError, error } = useScadenze(apiFilters);
    const { data: utenti = [] } = useUtenti();
    const { data: clienti = [] } = useClienti();
    const deleteMutation = useDeleteScadenza();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const utentiMap = useMemo(() => {
        const map = new Map();
        utenti.forEach((u) => map.set(u.Id, u));
        return map;
    }, [utenti]);
    const clientiMap = useMemo(() => {
        const map = new Map();
        clienti.forEach((c) => map.set(c.Id, c));
        return map;
    }, [clienti]);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const fullColumns = [
        { field: 'Name', headerName: 'NOME', flex: 1, minWidth: 200 },
        {
            field: 'Rec',
            headerName: 'RICORRENZA (RIC)',
            width: 130,
            valueFormatter: (value) => value > 0 ? `${value} mesi` : 'No',
        },
        {
            field: 'ScadenzaReale',
            headerName: 'DATA SCADENZA',
            width: 130,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: 'utenti',
            headerName: 'UTENTI',
            flex: 1,
            minWidth: 160,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const relations = params.row.ScadenzeUtenti ?? [];
                if (relations.length === 0)
                    return '—';
                return (_jsx(Stack, { direction: "row", spacing: 0.5, flexWrap: "wrap", alignItems: "center", sx: { py: 0.5 }, children: relations.map((su) => {
                        const u = utentiMap.get(su.UtenteId ?? 0);
                        const label = u
                            ? [u.Nome, u.Cognome].filter(Boolean).join(' ') || `#${u.Id}`
                            : `#${su.UtenteId}`;
                        return _jsx(Chip, { label: label, size: "small", variant: "outlined" }, su.Id);
                    }) }));
            },
        },
        {
            field: 'clienti',
            headerName: 'CLIENTI',
            flex: 1,
            minWidth: 160,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const relations = params.row.ScadenzeClienti ?? [];
                if (relations.length === 0)
                    return '—';
                return (_jsx(Stack, { direction: "row", spacing: 0.5, flexWrap: "wrap", alignItems: "center", sx: { py: 0.5 }, children: relations.map((sc) => {
                        const c = clientiMap.get(sc.ClienteId ?? 0);
                        const label = c ? c.Name || `#${c.Id}` : `#${sc.ClienteId}`;
                        return _jsx(Chip, { label: label, size: "small", variant: "outlined" }, sc.Id);
                    }) }));
            },
        },
        {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Box, { children: [_jsx(IconButton, { size: "small", onClick: () => onEdit(params.row.Id), title: "Modifica", children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(params.row.Id), title: "Elimina", children: _jsx(DeleteIcon, { fontSize: "small" }) })] })),
        },
    ];
    const smallColumns = [
        { field: 'Name', headerName: 'NOME', flex: 1, minWidth: 150 },
        {
            field: 'Rec',
            headerName: 'RIC',
            width: 70,
            valueFormatter: (value) => value > 0 ? `${value}m` : 'No',
        },
        {
            field: 'Date',
            headerName: 'DATA',
            width: 100,
            valueFormatter: (value) => formatDate(value),
        },
        {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (_jsxs(Stack, { direction: "row", spacing: 0.5, children: [_jsx(IconButton, { size: "small", onClick: () => onEdit(params.row.Id), title: "Modifica", children: _jsx(EditIcon, { fontSize: "small" }) }), _jsx(IconButton, { size: "small", color: "error", onClick: () => setDeleteTarget(params.row.Id), title: "Elimina", children: _jsx(DeleteIcon, { fontSize: "small" }) })] })),
        },
    ];
    const columns = isSmall ? smallColumns : fullColumns;
    const handleConfirmDelete = async () => {
        if (deleteTarget === null)
            return;
        await deleteMutation.mutateAsync({ id: deleteTarget });
        setDeleteTarget(null);
    };
    if (isError) {
        return (_jsxs(Alert, { severity: "error", children: ["Errore nel caricamento delle scadenze: ", error?.message ?? 'Errore sconosciuto'] }));
    }
    return (_jsxs(Box, { children: [scadenze.length === 0 && !isLoading && (_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: "Nessuna scadenza trovata." })), _jsx(DataGrid, { rows: scadenze, columns: columns, loading: isLoading, autoHeight: true, pageSizeOptions: [10, 25, 50], initialState: { pagination: { paginationModel: { pageSize: 25 } } }, disableRowSelectionOnClick: true, getRowHeight: () => 'auto', getRowId: (row) => row.Id, sx: {
                    '& .MuiDataGrid-cell': { py: 1 },
                } }), _jsx(ConfirmDeleteDialog, { open: deleteTarget !== null, title: "Elimina Scadenza", message: "Sei sicuro di voler eliminare questa scadenza?", loading: deleteMutation.isPending, onConfirm: handleConfirmDelete, onCancel: () => setDeleteTarget(null) })] }));
}
