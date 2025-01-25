import { Router } from 'express';

import HomeController from '../controllers/HomeController.js';

const router = Router();

router.get('/', HomeController.index);

export default router;
