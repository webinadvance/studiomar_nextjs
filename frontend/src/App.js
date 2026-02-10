import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UtentiPage from './pages/UtentiPage';
import ClientiPage from './pages/ClientiPage';
import ScadenzePage from './pages/ScadenzePage';
const queryClient = new QueryClient();
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/utenti", element: _jsx(UtentiPage, {}) }), _jsx(Route, { path: "/clienti", element: _jsx(ClientiPage, {}) }), _jsx(Route, { path: "/scadenze", element: _jsx(ScadenzePage, {}) })] }) }) }) }));
}
export default App;
