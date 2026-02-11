import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import MobileCardList from '../common/MobileCardList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Utente } from '../../../../shared';
import { useUtenti, useDeleteUtente } from '../../hooks/useUtenti';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface UtentiListProps {
  onEdit: (utente: Utente) => void;
}

export default function UtentiList({ onEdit }: UtentiListProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [search]);

  const { data: utenti, isLoading, isError, error } = useUtenti(debouncedSearch || undefined);
  const deleteMutation = useDeleteUtente();

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
        deleteMutation.mutate({ id });
      }
    },
    [deleteMutation],
  );

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const fullColumns = useMemo<GridColDef[]>(
    () => [
      { field: 'Id', headerName: 'ID', width: 80 },
      { field: 'Nome', headerName: 'Nome', flex: 1, minWidth: 150, valueGetter: (_value: unknown, row: Utente) => row.Nome ?? '' },
      { field: 'Cognome', headerName: 'Cognome', flex: 1, minWidth: 150, valueGetter: (_value: unknown, row: Utente) => row.Cognome ?? '' },
      { field: 'Email', headerName: 'Email', flex: 1.5, minWidth: 200, valueGetter: (_value: unknown, row: Utente) => row.Email ?? '' },
      {
        field: 'actions',
        headerName: 'Azioni',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<Utente>) => (
          <Box>
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.Id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [onEdit, handleDelete],
  );

  const smallColumns: GridColDef[] = [
    { field: 'Nome', headerName: 'Nome', flex: 1, minWidth: 150, valueGetter: (_value: unknown, row: Utente) => row.Nome ?? '' },
    { field: 'Cognome', headerName: 'Cognome', flex: 1, minWidth: 150, valueGetter: (_value: unknown, row: Utente) => row.Cognome ?? '' },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Utente>) => (
        <Box>
          <IconButton size="small" onClick={() => onEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.Id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columns = isSmall ? smallColumns : fullColumns;

  if (isError) {
    return (
      <Alert severity="error">
        Errore nel caricamento degli utenti: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TextField
        label="Cerca utenti"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, flexShrink: 0 }}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Caricamento...</Typography>
        </Box>
      ) : isSmall ? (
        <MobileCardList
          data={utenti ?? []}
          keyExtractor={(item) => item.Id}
          isLoading={isLoading}
          onEdit={(item) => onEdit(item)}
          onDelete={(item) => handleDelete(item.Id)}
          renderContent={(item) => (
             <Box>
               <Typography variant="subtitle1" fontWeight={600}>
                 {[item.Nome, item.Cognome].filter(Boolean).join(' ')}
               </Typography>
               <Typography 
                 variant="body2" 
                 color="text.secondary" 
                 sx={{ 
                   wordBreak: 'break-all',
                   overflow: 'hidden',
                   textOverflow: 'ellipsis',
                   display: '-webkit-box',
                   WebkitLineClamp: 1,
                   WebkitBoxOrient: 'vertical'
                 }}
               >
                 {item.Email}
               </Typography>
                <Typography variant="caption" color="text.disabled">
                  ID: {item.Id}
                </Typography>
             </Box>
          )}
        />
      ) : (
        <DataGrid
          rows={utenti ?? []}
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
            '& .MuiDataGrid-main': { flex: 1 },
          }}
        />
      )}
    </Box>
  );
}
