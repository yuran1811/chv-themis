import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';

const router = Router();

router.get('/', HomeController.show);

export default router;
