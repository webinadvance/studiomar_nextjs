import { ReactNode } from 'react';
import { Box, Card, CardContent, CardActions, IconButton, Stack, CircularProgress, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MobileCardListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  renderContent: (item: T) => ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
}

export default function MobileCardList<T>({ 
  data, 
  keyExtractor, 
  renderContent, 
  onEdit, 
  onDelete,
  isLoading 
}: MobileCardListProps<T>) {
  if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
        </Box>
      );
  }

  if (!data || data.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Nessun elemento trovato.</Typography>
        </Box>
      );
  }

  return (
    <Stack spacing={2}>
      {data.map((item) => (
        <Card 
            key={keyExtractor(item)} 
            sx={{ 
                borderRadius: 3, 
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.05)'
            }}
        >
          <CardContent sx={{ pb: 1, '&:last-child': { pb: 2 } }}>
            {renderContent(item)}
          </CardContent>
          {(onEdit || onDelete) && (
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0, px: 2, pb: 1.5 }}>
                 {onEdit && (
                    <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: 'primary.main', bgcolor: 'primary.50' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                 )}
                 {onDelete && (
                    <IconButton size="small" onClick={() => onDelete(item)} sx={{ color: 'error.main', bgcolor: 'error.50', ml: 1 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                 )}
            </CardActions>
          )}
        </Card>
      ))}
    </Stack>
  );
}
