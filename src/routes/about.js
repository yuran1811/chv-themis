import { Router } from 'express';

import AboutController from '../controllers/AboutController.js';

const router = Router();

router.get('/', AboutController.index);

export default router;
