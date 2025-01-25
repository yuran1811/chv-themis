import { processEJSData, getLogList } from '../utils/index.js';

class HomeController {
  // [GET] /home
  index(req, res, next) {
    res.render('home', {
      ...processEJSData(req),
      navStatus: 'home',
      logs: getLogList(req?.user),
    });
  }
}

export default new HomeController();
