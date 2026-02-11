import { useState, useCallback } from 'react';
import { Box, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ScadenzeFilters, { type ScadenzeFilterValues } from '../components/scadenze/ScadenzeFilters';
import ScadenzeList from '../components/scadenze/ScadenzeList';
import ScadenzeForm from '../components/scadenze/ScadenzeForm';
import PageHeader from '../components/common/PageHeader';
import { useScadenza, useExportScadenzasPDF } from '../hooks/useScadenze';

export default function ScadenzePage() {
  const [filters, setFilters] = useState<ScadenzeFilterValues>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const { data: editingScadenza, isLoading: isScadenzaLoading } = useScadenza(editingId ?? 0);
  const exportMutation = useExportScadenzasPDF();

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((id: number) => {
    setEditingId(id);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
  }, []);

  const handleExportPDF = useCallback(async () => {
    try {
      const blob = await exportMutation.mutateAsync(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scadenze_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  }, [filters, exportMutation]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
       <PageHeader 
          title="Scadenze" 
          subtitle="Gestisci le scadenze imminenti e gli eventi."
         action={
           <>
             <Button
               variant="outlined"
               startIcon={<FileDownloadIcon />}
               onClick={handleExportPDF}
               disabled={exportMutation.isPending}
             >
               {exportMutation.isPending ? 'Esportazione...' : 'Esporta PDF'}
             </Button>
             <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
               Nuova Scadenza
             </Button>
           </>
         }
       />

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3, flexShrink: 0 }} elevation={0}>
        <ScadenzeFilters onChange={setFilters} />
      </Paper>

      <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} elevation={0}>
         <ScadenzeList filters={filters} onEdit={handleEdit} />
      </Paper>

      <ScadenzeForm open={formOpen} onClose={handleClose} scadenza={editingScadenza} isLoading={isScadenzaLoading} />
    </Box>
  );
}