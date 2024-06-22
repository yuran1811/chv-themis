import { Router } from 'express';
import ProblemsController from '../controllers/ProblemsController.js';
import fileUpload from '../tools/middlewares/fileUpload.js';

const router = Router();

router.get('/list', ProblemsController.list);
router.post('/submit/:user', fileUpload.array('submissions', 10), ProblemsController.submit);

export default router;
