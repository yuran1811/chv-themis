import * as utils from '../tools/utils.js';

class HomeController {
  // [GET] /home
  show(req, res, next) {
    const user = utils.getAuthUser(req);
    const logs = utils.getLogList(user);

    res.render('home', {
      ...utils.defaultEJS,
      isAuth: utils.getAuthStatus(req),
      user,
      logs,
    });
  }
}

export default new HomeController();
