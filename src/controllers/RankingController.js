import * as utils from '../tools/utils.js';

class RankingController {
	// [GET] /ranking/
	ranking(req, res, next) {
		res.json(utils.getRankingList());
		// res.render('ranking', {
		// 	...utils.defaultEJS,
		// 	navStatus: 'ranking',
		// 	isAuth: utils.getAuthStatus(req),
		// 	user: utils.getAuthUser(req),
		// 	rankings: utils.getRankingList(),
		// });
	}
}

export default new RankingController();

/* 

import chokidar from 'chokidar';

const watcher = chokidar.watch(join(__dirname, 'resources', '_rankings'), {
	ignored: /(^|[\/\\])\../,
	persistent: true,
});
watcher
	.on('add', (path) => console.log(`File ${path} has been added`))
	.on('change', (path) => console.log(`File ${path} has been changed`))
	.on('unlink', (path) => console.log(`File ${path} has been removed`));
	
*/
