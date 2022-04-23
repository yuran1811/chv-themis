import * as utils from '../tools/utils.js';

class RankingController {
	// [GET] /ranking/
	ranking(req, res, next) {
		const rankings = utils.getRankingList();
		const { tasks, status, scores } = utils.getRankingData(rankings);
		// res.json(scores);
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
