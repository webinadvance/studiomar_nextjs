import { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ScadenzeFilters, { type ScadenzeFilterValues } from '../components/scadenze/ScadenzeFilters';
import ScadenzeList from '../components/scadenze/ScadenzeList';
import ScadenzeForm from '../components/scadenze/ScadenzeForm';
import { useScadenza, useExportScadenzasPDF } from '../hooks/useScadenze';

export default function ScadenzePage() {
  const [filters, setFilters] = useState<ScadenzeFilterValues>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const { data: editingScadenza } = useScadenza(editingId ?? 0);
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h4">Scadenze</Typography>
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
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
        </Box>
      </Box>

      <ScadenzeFilters onChange={setFilters} />

      <ScadenzeList filters={filters} onEdit={handleEdit} />

      <ScadenzeForm open={formOpen} onClose={handleClose} scadenza={editingScadenza ?? null} />
    </Box>
  );
}
