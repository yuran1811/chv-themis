import { getRankingData, processEJSData } from '../utils/index.js';

class RankingController {
  // [GET] /ranking/
  index(req, res, next) {
    const { tasks, status, fail, ModifiedDate } = getRankingData();
    if (fail) res.redirect('/');

    res.render('ranking', {
      ...processEJSData(req),
      navStatus: 'ranking',
      docSubTitle: 'Ranking',
      tasks,
      status,
      ModifiedDate,
    });
  }
}

export default new RankingController();
