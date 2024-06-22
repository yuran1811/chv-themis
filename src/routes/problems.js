import { Router } from 'express';
import ProblemsController from '../controllers/ProblemsController.js';
import fileUpload from '../tools/middlewares/fileUpload.js';

const router = Router();

router.post('/submit/:user', fileUpload.array('submissions', 10), ProblemsController.submit);
router.get('/list', ProblemsController.list);

export default router;
