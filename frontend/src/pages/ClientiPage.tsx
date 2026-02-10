import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/common/PageHeader';
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
      <PageHeader
        title="Clienti"
        subtitle="Manage your client database."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Nuovo Cliente
          </Button>
        }
      />
      
      <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0}>
         <ClientiList onEdit={handleEdit} />
      </Paper>
      
      <ClientiForm open={formOpen} onClose={handleClose} editId={editId} />
    </Box>
  );
}