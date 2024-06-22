import * as utils from '../tools/utils.js';

class AboutController {
  // [GET] /about
  show(req, res, next) {
    res.render('about', {
      ...utils.defaultEJS,
      navStatus: 'about',
      isAuth: utils.getAuthStatus(req),
      user: utils.getAuthUser(req),
    });
  }
}

export default new AboutController();
