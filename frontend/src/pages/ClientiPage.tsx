import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ClientiList from '../components/clienti/ClientiList';
import ClientiForm from '../components/clienti/ClientiForm';

export default function ClientiPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = useCallback(() => {
    setEditId(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    setEditId(id);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditId(null);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Clienti
      </Typography>
      <ClientiList onEdit={handleEdit} onAdd={handleAdd} />
      <ClientiForm open={formOpen} onClose={handleClose} editId={editId} />
    </Box>
  );
}
