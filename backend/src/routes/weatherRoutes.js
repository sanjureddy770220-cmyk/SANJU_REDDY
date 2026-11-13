// backend/src/routes/weatherRoutes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as weatherController from '../controllers/weatherController.js';

const router = Router();

// Allow authenticated requests (and demo mode)
router.use(requireAuth);

router.get('/', weatherController.getWeather);

export default router;

