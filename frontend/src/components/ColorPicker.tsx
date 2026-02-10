import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import CheckIcon from '@mui/icons-material/Check';

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#4b5563', // Gray
];

const ColorPicker: React.FC = () => {
  const { accentColor, setAccentColor } = useThemeContext();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Colore Accento
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {PRESET_COLORS.map((color) => (
          <Tooltip key={color} title={color}>
            <Box
              onClick={() => setAccentColor(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                borderColor: accentColor === color ? 'divider' : 'transparent',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              {accentColor === color && (
                <CheckIcon sx={{ color: '#fff', fontSize: 18 }} />
              )}
            </Box>
          </Tooltip>
        ))}
        <input
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          style={{
            width: 32,
            height: 32,
            padding: 0,
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
        />
      </Box>
    </Box>
  );
};

export default ColorPicker;
