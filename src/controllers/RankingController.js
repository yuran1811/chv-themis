import * as utils from '../tools/utils.js';

class RankingController {
	// [GET] /ranking/
	ranking(req, res, next) {
		const rankings = utils.getRankingList('off');
		const { tasks, status, scores, fail } = utils.getRankingData(rankings);

		if (fail) {
			res.redirect('/');
			return;
		}

		res.render('ranking', {
			...utils.defaultEJS,
			navStatus: 'ranking',
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
			rankings,
			tasks,
			status,
		});
	}
}

export default new RankingController();
