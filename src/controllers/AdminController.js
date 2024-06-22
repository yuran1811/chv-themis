import * as utils from '../tools/utils.js';

class AdminController {
  // [GET] /admin/dashboard
  admin(req, res, next) {
    res.render('admin', {
      ...utils.defaultEJS,
      isAuth: utils.getAuthStatus(req),
      user: utils.getAuthUser(req),
    });
  }
}

export default new AdminController();
