import * as utils from '../tools/utils.js';

class HomeController {
  // [GET] /home
  show(req, res, next) {
    const user = utils.getAuthUser(req);

    res.render('home', {
      ...utils.defaultEJS,
      isAuth: utils.getAuthStatus(req),
      user,
      logs: utils.getLogList(user),
    });
  }
}

export default new HomeController();
