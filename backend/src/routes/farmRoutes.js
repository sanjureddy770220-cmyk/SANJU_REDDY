// backend/src/routes/farmRoutes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as farmController from '../controllers/farmController.js';

const router = Router();

// Protect all farm routes with Supabase JWT authentication
router.use(requireAuth);

router.get('/', farmController.getFarms);
router.post('/', farmController.createFarm);
router.get('/:id', farmController.getFarm);
router.put('/:id', farmController.updateFarm);
router.delete('/:id', farmController.deleteFarm);

export default router;

