import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UtentiPage from './pages/UtentiPage';
import ClientiPage from './pages/ClientiPage';
import ScadenzePage from './pages/ScadenzePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/utenti" element={<UtentiPage />} />
            <Route path="/clienti" element={<ClientiPage />} />
            <Route path="/scadenze" element={<ScadenzePage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
