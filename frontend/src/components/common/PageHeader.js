import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Divider, useTheme, alpha } from '@mui/material';
export default function PageHeader({ title, subtitle, action }) {
    const theme = useTheme();
    return (_jsxs(Box, { sx: { mb: 4 }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", component: "h1", fontWeight: "700", color: "text.primary", children: title }), subtitle && (_jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mt: 0.5 }, children: subtitle }))] }), action && (_jsx(Box, { sx: {
                            display: 'flex',
                            gap: 2,
                            alignSelf: { xs: 'stretch', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' }
                        }, children: action }))] }), _jsx(Divider, { sx: { mt: 3, borderColor: alpha(theme.palette.primary.main, 0.1) } })] }));
}
