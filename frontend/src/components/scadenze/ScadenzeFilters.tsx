import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
import type { Utente, Cliente } from '../../../../shared';

export interface ScadenzeFilterValues {
  filter?: string;
  date_start?: string;
  date_end?: string;
  utente_ids?: number[];
  cliente_ids?: number[];
}

interface ScadenzeFiltersProps {
  onChange: (filters: ScadenzeFilterValues) => void;
}

export default function ScadenzeFilters({ onChange }: ScadenzeFiltersProps) {
  const [search, setSearch] = useState('');
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [selectedUtenti, setSelectedUtenti] = useState<Utente[]>([]);
  const [selectedClienti, setSelectedClienti] = useState<Cliente[]>([]);

  const { data: utenti = [], isLoading: utentiLoading } = useUtenti();
  const { data: clienti = [], isLoading: clientiLoading } = useClienti();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const emitFilters = useCallback(() => {
    const filters: ScadenzeFilterValues = {};
    if (debouncedSearch) filters.filter = debouncedSearch;
    if (dateStart) filters.date_start = format(dateStart, 'yyyy-MM-dd');
    if (dateEnd) filters.date_end = format(dateEnd, 'yyyy-MM-dd');
    if (selectedUtenti.length > 0) filters.utente_ids = selectedUtenti.map((u) => u.Id);
    if (selectedClienti.length > 0) filters.cliente_ids = selectedClienti.map((c) => c.Id);
    onChange(filters);
  }, [debouncedSearch, dateStart, dateEnd, selectedUtenti, selectedClienti, onChange]);

  useEffect(() => {
    emitFilters();
  }, [emitFilters]);

  const handleReset = () => {
    setSearch('');
    setDateStart(null);
    setDateEnd(null);
    setSelectedUtenti([]);
    setSelectedClienti([]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <TextField
            label="Cerca"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          />

          <DatePicker
            label="Data da"
            value={dateStart}
            onChange={setDateStart}
            slotProps={{ textField: { size: 'small', fullWidth: true, sx: { minWidth: { xs: '100%', sm: 160 } } } }}
          />

          <DatePicker
            label="Data a"
            value={dateEnd}
            onChange={setDateEnd}
            slotProps={{ textField: { size: 'small', fullWidth: true, sx: { minWidth: { xs: '100%', sm: 160 } } } }}
          />

          <Autocomplete
            multiple
            size="small"
            options={utenti}
            loading={utentiLoading}
            getOptionLabel={(o) => [o.Nome, o.Cognome].filter(Boolean).join(' ') || `Utente #${o.Id}`}
            value={selectedUtenti}
            onChange={(_e, v) => setSelectedUtenti(v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={[option.Nome, option.Cognome].filter(Boolean).join(' ') || `#${option.Id}`}
                  size="small"
                  {...getTagProps({ index })}
                  key={option.Id}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Utenti" fullWidth />}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
            isOptionEqualToValue={(opt, val) => opt.Id === val.Id}
          />

          <Autocomplete
            multiple
            size="small"
            options={clienti}
            loading={clientiLoading}
            getOptionLabel={(o) => o.Name || `Cliente #${o.Id}`}
            value={selectedClienti}
            onChange={(_e, v) => setSelectedClienti(v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.Name || `#${option.Id}`}
                  size="small"
                  {...getTagProps({ index })}
                  key={option.Id}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Clienti" fullWidth />}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
            isOptionEqualToValue={(opt, val) => opt.Id === val.Id}
          />

          <Button variant="outlined" size="small" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
