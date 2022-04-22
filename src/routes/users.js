import { Router } from 'express';
import UsersController from '../controllers/UsersController.js';

const router = Router();

router.post('/auth', UsersController.auth);

export default router;
