import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Stack, Autocomplete, Chip, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useUtenti } from '../../hooks/useUtenti';
import { useClienti } from '../../hooks/useClienti';
export default function ScadenzeFilters({ onChange }) {
    const [search, setSearch] = useState('');
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [selectedUtenti, setSelectedUtenti] = useState([]);
    const [selectedClienti, setSelectedClienti] = useState([]);
    const { data: utenti = [], isLoading: utentiLoading } = useUtenti();
    const { data: clienti = [], isLoading: clientiLoading } = useClienti();
    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);
    const emitFilters = useCallback(() => {
        const filters = {};
        if (debouncedSearch)
            filters.filter = debouncedSearch;
        if (dateStart)
            filters.date_start = format(dateStart, 'yyyy-MM-dd');
        if (dateEnd)
            filters.date_end = format(dateEnd, 'yyyy-MM-dd');
        if (selectedUtenti.length > 0)
            filters.utente_ids = selectedUtenti.map((u) => u.id);
        if (selectedClienti.length > 0)
            filters.cliente_ids = selectedClienti.map((c) => c.id);
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
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(Box, { sx: { mb: 3 }, children: _jsxs(Stack, { direction: "row", spacing: 2, flexWrap: "wrap", useFlexGap: true, children: [_jsx(TextField, { label: "Cerca", size: "small", value: search, onChange: (e) => setSearch(e.target.value), fullWidth: true, sx: { minWidth: { xs: '100%', sm: 200 } } }), _jsx(DatePicker, { label: "Data da", value: dateStart, onChange: setDateStart, slotProps: { textField: { size: 'small', fullWidth: true, sx: { minWidth: { xs: '100%', sm: 160 } } } } }), _jsx(DatePicker, { label: "Data a", value: dateEnd, onChange: setDateEnd, slotProps: { textField: { size: 'small', fullWidth: true, sx: { minWidth: { xs: '100%', sm: 160 } } } } }), _jsx(Autocomplete, { multiple: true, size: "small", options: utenti, loading: utentiLoading, getOptionLabel: (o) => [o.nome, o.cognome].filter(Boolean).join(' ') || `Utente #${o.id}`, value: selectedUtenti, onChange: (_e, v) => setSelectedUtenti(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: [option.nome, option.cognome].filter(Boolean).join(' ') || `#${option.id}`, size: "small", ...getTagProps({ index }), key: option.id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Utenti", fullWidth: true }), sx: { minWidth: { xs: '100%', sm: 220 } }, isOptionEqualToValue: (opt, val) => opt.id === val.id }), _jsx(Autocomplete, { multiple: true, size: "small", options: clienti, loading: clientiLoading, getOptionLabel: (o) => o.name || `Cliente #${o.id}`, value: selectedClienti, onChange: (_e, v) => setSelectedClienti(v), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: option.name || `#${option.id}`, size: "small", ...getTagProps({ index }), key: option.id }))), renderInput: (params) => _jsx(TextField, { ...params, label: "Clienti", fullWidth: true }), sx: { minWidth: { xs: '100%', sm: 220 } }, isOptionEqualToValue: (opt, val) => opt.id === val.id }), _jsx(Button, { variant: "outlined", size: "small", onClick: handleReset, children: "Reset" })] }) }) }));
}
