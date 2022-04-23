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
