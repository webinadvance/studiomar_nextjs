import { useMemo, useState } from 'react';
import { Box, IconButton, Chip, Stack, Typography, Alert } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';
import { useScadenze, useDeleteScadenza } from '../../hooks/useScadenze';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
import type { ScadenzeFilterValues } from './ScadenzeFilters';
import type { ScadenzeWithRelations, Utente, Cliente } from '../../../../shared';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog';
import { formatRecurrence } from '../../utils/formatRecurrence';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ScadenzeListProps {
  filters: ScadenzeFilterValues;
  onEdit: (id: number) => void;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), 'dd/MM/yyyy');
  } catch {
    return iso;
  }
}

export default function ScadenzeList({ filters, onEdit }: ScadenzeListProps) {
  const apiFilters = useMemo(() => {
    const f: Record<string, string | number> = {};
    if (filters.filter) f.filter = filters.filter;
    if (filters.date_start) f.date_start = filters.date_start;
    if (filters.date_end) f.date_end = filters.date_end;
    // For multi-select, use the first id only (API supports single id)
    if (filters.utente_ids?.length) f.utente_id = filters.utente_ids[0];
    if (filters.cliente_ids?.length) f.cliente_id = filters.cliente_ids[0];
    return f;
  }, [filters]);

  const { data: scadenze = [], isLoading, isError, error } = useScadenze(apiFilters);
  const { data: utenti = [] } = useUtenti();
  const { data: clienti = [] } = useClienti();
  const deleteMutation = useDeleteScadenza();

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const utentiMap = useMemo(() => {
    const map = new Map<number, Utente>();
    utenti.forEach((u) => map.set(u.Id, u));
    return map;
  }, [utenti]);

  const clientiMap = useMemo(() => {
    const map = new Map<number, Cliente>();
    clienti.forEach((c) => map.set(c.Id, c));
    return map;
  }, [clienti]);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const fullColumns: GridColDef<ScadenzeWithRelations>[] = [
    { field: 'Name', headerName: 'Nome', flex: 1, minWidth: 180 },
    {
      field: 'Date',
      headerName: 'Data',
      width: 120,
      valueFormatter: (value: string | null) => formatDate(value),
    },
    {
      field: 'CalculatedDate',
      headerName: 'Data calcolata',
      width: 130,
      valueFormatter: (value: string | undefined) => formatDate(value),
    },
    {
      field: 'Rec',
      headerName: 'Ricorrenza',
      width: 130,
      valueFormatter: (value: number) => formatRecurrence(value),
    },
    {
      field: 'utenti',
      headerName: 'Utenti',
      flex: 1,
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const relations = params.row.ScadenzeUtenti ?? [];
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" sx={{ py: 0.5 }}>
            {relations.map((su) => {
              const u = utentiMap.get(su.UtenteId ?? 0);
              const label = u
                ? [u.Nome, u.Cognome].filter(Boolean).join(' ') || `#${u.Id}`
                : `#${su.UtenteId}`;
              return <Chip key={su.Id} label={label} size="small" variant="outlined" />;
            })}
          </Stack>
        );
      },
    },
    {
      field: 'clienti',
      headerName: 'Clienti',
      flex: 1,
      minWidth: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const relations = params.row.ScadenzeClienti ?? [];
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" sx={{ py: 0.5 }}>
            {relations.map((sc) => {
              const c = clientiMap.get(sc.ClienteId ?? 0);
              const label = c ? c.Name || `#${c.Id}` : `#${sc.ClienteId}`;
              return <Chip key={sc.Id} label={label} size="small" variant="outlined" />;
            })}
          </Stack>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => onEdit(params.row.Id)} title="Modifica">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteTarget(params.row.Id)}
            title="Elimina"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const smallColumns: GridColDef<ScadenzeWithRelations>[] = [
    { field: 'Name', headerName: 'Nome', flex: 1, minWidth: 120 },
    {
      field: 'Date',
      headerName: 'Data',
      minWidth: 110,
      valueFormatter: (value: string | null) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => onEdit(params.row.Id)} title="Modifica">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteTarget(params.row.Id)}
            title="Elimina"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const columns = isSmall ? smallColumns : fullColumns;

  const handleConfirmDelete = async () => {
    if (deleteTarget === null) return;
    await deleteMutation.mutateAsync({ id: deleteTarget });
    setDeleteTarget(null);
  };

  if (isError) {
    return (
      <Alert severity="error">
        Errore nel caricamento delle scadenze: {(error as Error)?.message ?? 'Errore sconosciuto'}
      </Alert>
    );
  }

  return (
    <Box>
      {scadenze.length === 0 && !isLoading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Nessuna scadenza trovata.
        </Typography>
      )}

      <DataGrid
        rows={scadenze}
        columns={columns}
        loading={isLoading}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': { py: 1 },
        }}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Elimina Scadenza"
        message="Sei sicuro di voler eliminare questa scadenza?"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
