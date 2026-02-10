import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as clientiController from '../controllers/clientiController';

const router = Router();

// More specific routes first
router.get('/clienti/min', asyncHandler(clientiController.listMin));

// Handle both with and without trailing slashes
router.get('/clienti', asyncHandler(clientiController.list));
router.get('/clienti/', asyncHandler(clientiController.list));
router.get('/clienti/:id', asyncHandler(clientiController.getById));
router.post('/clienti', asyncHandler(clientiController.create));
router.post('/clienti/', asyncHandler(clientiController.create));
router.put('/clienti/:id', asyncHandler(clientiController.update));
router.delete('/clienti/:id', asyncHandler(clientiController.remove));

export default router;
