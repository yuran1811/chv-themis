import { Router } from 'express';

import ProblemsController from '../controllers/ProblemsController.js';
import ensureLoggedIn from '../middlewares/ensureLoggedIn.js';
import fileUpload from '../middlewares/fileUpload.js';

const router = Router();

router.get('/list', ProblemsController.list);
router.post('/submit/:user', ensureLoggedIn, fileUpload.array('submissions', 10), ProblemsController.submit);

export default router;
