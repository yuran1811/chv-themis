import { Router } from 'express';
import SubmitCodeController from '../controllers/SubmitCodeController.js';

const router = Router();

router.post('/:user', SubmitCodeController.submit);
router.get('/', SubmitCodeController.show);

export default router;
