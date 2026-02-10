import { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h4">Utenti</Typography>
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuovo Utente
          </Button>
        </Box>
      </Box>

      <UtentiList onEdit={handleEdit} />

      <UtentiForm open={formOpen} onClose={handleClose} utente={editingUtente} />
    </Box>
  );
}
