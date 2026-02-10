import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UtentiPage from './pages/UtentiPage';
import ClientiPage from './pages/ClientiPage';
import ScadenzePage from './pages/ScadenzePage';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/utenti"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UtentiPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clienti"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientiPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/scadenze"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ScadenzePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
