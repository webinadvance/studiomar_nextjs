import { Router } from 'express';
import * as utentiController from '../controllers/utentiController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// More specific routes first
router.get('/utenti/min', asyncHandler(utentiController.listMin));

// Handle both with and without trailing slashes
router.get('/utenti', asyncHandler(utentiController.list));
router.get('/utenti/', asyncHandler(utentiController.list));
router.get('/utenti/:id', asyncHandler(utentiController.getById));
router.post('/utenti', asyncHandler(utentiController.create));
router.post('/utenti/', asyncHandler(utentiController.create));
router.put('/utenti/:id', asyncHandler(utentiController.update));
router.delete('/utenti/:id', asyncHandler(utentiController.remove));

export default router;
