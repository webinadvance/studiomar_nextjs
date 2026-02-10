import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { userContext } from './middleware/userContext';
import utentiRoutes from './routes/utentiRoutes';
import clientiRoutes from './routes/clientiRoutes';
import scadenzeRoutes from './routes/scadenzeRoutes';

const app = express();

// Don't redirect on trailing slash
app.set('strict routing', false);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userContext);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/v1', utentiRoutes);
app.use('/api/v1', clientiRoutes);
app.use('/api/v1', scadenzeRoutes);

// 404 handler for unmatched API routes
app.use('/api/v1', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use(errorHandler);

export default app;
