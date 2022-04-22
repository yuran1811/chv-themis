import * as utils from '../tools/utils.js';

class RankingController {
	// [GET] /ranking/
	ranking(req, res, next) {
		res.render('ranking', {
			...utils.defaultEJS,
			navStatus: 'ranking',
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
		});
	}
}

export default new RankingController();
