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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
       <PageHeader
          title="Clienti"
          subtitle="Gestisci il tuo database di clienti."
         action={
           <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
             Nuovo Cliente
           </Button>
         }
       />
       
       <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} elevation={0}>
          <ClientiList onEdit={handleEdit} />
       </Paper>
       
       <ClientiForm open={formOpen} onClose={handleClose} editId={editId} />
    </Box>
  );
}