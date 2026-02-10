import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDeleteDialog({
  open,
  title = 'Confermare eliminazione',
  message = 'Sei sicuro di voler eliminare questo elemento?',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Annulla
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Eliminazione...' : 'Elimina'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
