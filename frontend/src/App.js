import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UtentiPage from './pages/UtentiPage';
import ClientiPage from './pages/ClientiPage';
import ScadenzePage from './pages/ScadenzePage';
import LoginPage from './pages/LoginPage';
const queryClient = new QueryClient();
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(ScadenzePage, {}) }) }) }), _jsx(Route, { path: "/utenti", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(UtentiPage, {}) }) }) }), _jsx(Route, { path: "/clienti", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(ClientiPage, {}) }) }) })] }) }) }) }));
}
export default App;
