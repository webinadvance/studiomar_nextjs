import { Router } from 'express';
import * as scadenzeController from '../controllers/scadenzeController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Handle both with and without trailing slashes
router.get('/scadenze', asyncHandler(scadenzeController.list));
router.get('/scadenze/', asyncHandler(scadenzeController.list));
router.get('/scadenze/export/pdf', asyncHandler(scadenzeController.exportPDF));
router.get('/scadenze/:id', asyncHandler(scadenzeController.getById));
router.post('/scadenze', asyncHandler(scadenzeController.create));
router.post('/scadenze/', asyncHandler(scadenzeController.create));
router.put('/scadenze/:id', asyncHandler(scadenzeController.update));
router.delete('/scadenze/:id', asyncHandler(scadenzeController.remove));

export default router;
