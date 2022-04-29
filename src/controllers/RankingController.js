import * as utils from '../tools/utils.js';

class RankingController {
	// [GET] /ranking/
	ranking(req, res, next) {
		const { tasks, status, fail, ModifiedDate } = utils.getRankingData();

		if (fail) {
			res.redirect('/');
			return;
		}

		res.render('ranking', {
			...utils.defaultEJS,
			navStatus: 'ranking',
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
			tasks,
			status,
			ModifiedDate
		});
	}
}

export default new RankingController();
