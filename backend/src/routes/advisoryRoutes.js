// backend/src/routes/advisoryRoutes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as advisoryController from '../controllers/advisoryController.js';

const router = Router();

// Protect all advisory routes with Supabase JWT authentication
router.use(requireAuth);

router.post('/', upload.single('image'), advisoryController.createAdvisory);
router.get('/', advisoryController.getAdvisories);
router.get('/:id', advisoryController.getAdvisory);
router.delete('/:id', advisoryController.deleteAdvisory);

export default router;

