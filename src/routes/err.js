import { Router } from 'express';
import * as utils from '../tools/utils.js';

const router = Router();

router.get('/', (req, res) => {
	res.render('err', { ...utils.defaultEJS, navStatus: 'err' });
});

export default router;
