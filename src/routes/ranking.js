import { Router } from 'express';
import RankingController from '../controllers/RankingController.js';

const router = Router();

router.get('/', RankingController.ranking);

export default router;
