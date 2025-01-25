import { Router } from 'express';

import AdminController from '../controllers/AdminController.js';
import ensureLoggedIn from '../middlewares/ensureLoggedIn.js';

const router = Router();

router.get('/dashboard', ensureLoggedIn, AdminController.dashboard);

export default router;
