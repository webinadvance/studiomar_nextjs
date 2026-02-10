import { ReactNode } from 'react';
import { Box, Typography, Divider, useTheme, alpha } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="700" color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignSelf: { xs: 'stretch', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            {action}
          </Box>
        )}
      </Box>
      <Divider sx={{ mt: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
    </Box>
  );
}
