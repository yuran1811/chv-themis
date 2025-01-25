import { Router } from 'express';

import SubmitCodeController from '../controllers/SubmitCodeController.js';
import ensureLoggedIn from '../middlewares/ensureLoggedIn.js';

const router = Router();

router.post('/:user', ensureLoggedIn, SubmitCodeController.submit);
router.get('/', ensureLoggedIn, SubmitCodeController.index);

export default router;
