import { Router } from 'express';

import ProfileController from '../controllers/ProfileController.js';
import ensureLoggedIn from '../middlewares/ensureLoggedIn.js';

const router = Router();

router.post('/change-password', ensureLoggedIn, ProfileController.changePassword);
router.get('/', ensureLoggedIn, ProfileController.index);

export default router;
