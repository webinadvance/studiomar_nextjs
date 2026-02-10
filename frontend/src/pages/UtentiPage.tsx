import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/common/PageHeader';
import UtentiList from '../components/utenti/UtentiList';
import UtentiForm from '../components/utenti/UtentiForm';
import type { Utente } from '../api/utenti';

export default function UtentiPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingUtente, setEditingUtente] = useState<Utente | null>(null);

  const handleEdit = useCallback((utente: Utente) => {
    setEditingUtente(utente);
    setFormOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingUtente(null);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingUtente(null);
  }, []);

  return (
    <Box>
       <PageHeader
         title="Utenti"
         subtitle="Gestisci gli utenti e le autorizzazioni del sistema."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuovo Utente
          </Button>
        }
      />

      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0}>
        <UtentiList onEdit={handleEdit} />
      </Paper>

      <UtentiForm open={formOpen} onClose={handleClose} utente={editingUtente} />
    </Box>
  );
}