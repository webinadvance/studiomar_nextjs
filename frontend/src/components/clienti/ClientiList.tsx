import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MobileCardList from '../common/MobileCardList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Cliente } from '../../../../shared';
import { useClienti, useDeleteCliente } from '../../hooks/useClienti';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ClientiListProps {
  onEdit: (id: number) => void;
}

export default function ClientiList({ onEdit }: ClientiListProps) {
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: clienti, isLoading, isError, error } = useClienti(debouncedFilter || undefined);
  const deleteMutation = useDeleteCliente();

  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFilter(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.Id });
    } finally {
      setDeleteTarget(null);
    }
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const fullColumns: GridColDef[] = [
    { field: 'Id', headerName: 'ID', width: 80 },
    { field: 'Name', headerName: 'Nome', flex: 1, minWidth: 200 },
    {
      field: 'IsActive',
      headerName: 'Attivo',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row.Id)}
            aria-label="modifica"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteTarget(params.row as Cliente)}
            aria-label="elimina"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const smallColumns: GridColDef[] = [
    { field: 'Name', headerName: 'Nome', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row.Id)}
            aria-label="modifica"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteTarget(params.row as Cliente)}
            aria-label="elimina"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columns = isSmall ? smallColumns : fullColumns;

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Errore nel caricamento dei clienti: {(error as Error)?.message ?? 'Errore sconosciuto'}
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        <TextField
          label="Cerca clienti"
          variant="outlined"
          size="small"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          fullWidth
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 400 } }}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isSmall ? (
        <MobileCardList
          data={clienti ?? []}
          keyExtractor={(item) => item.Id}
          isLoading={isLoading}
          onEdit={(item) => onEdit(item.Id)}
          onDelete={(item) => setDeleteTarget(item)}
          renderContent={(item) => (
             <Box>
               <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                 {item.Name}
               </Typography>
               <Stack direction="row" spacing={1} alignItems="center">
                  {item.IsActive ? (
                      <Chip label="Attivo" color="success" size="small" variant="outlined" />
                  ) : (
                      <Chip label="Non attivo" color="error" size="small" variant="outlined" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                      ID: {item.Id}
                  </Typography>
               </Stack>
             </Box>
          )}
        />
      ) : (
        <DataGrid
          rows={clienti ?? []}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          getRowId={(row) => row.Id}
          sx={{
            flex: 1,
            minHeight: 0,
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-main': { flex: 1 },
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare il cliente &quot;{deleteTarget?.Name}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
            Annulla
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Elimina'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
