import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
function Dashboard() {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: isSmall ? 'h5' : 'h4', gutterBottom: true, children: "Dashboard" }), _jsxs(Grid, { container: true, spacing: isSmall ? 2 : 3, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Total Scadenze" }), _jsx(Typography, { variant: isSmall ? 'h6' : 'h5', children: "\u2014" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Active Users" }), _jsx(Typography, { variant: isSmall ? 'h6' : 'h5', children: "\u2014" })] }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Active Clients" }), _jsx(Typography, { variant: isSmall ? 'h6' : 'h5', children: "\u2014" })] }) }) })] })] }));
}
export default Dashboard;
