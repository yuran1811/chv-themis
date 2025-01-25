import { processEJSData } from '../utils/index.js';

class AdminController {
  // [GET] /admin/dashboard
  dashboard(req, res, next) {
    if (!!req?.user?.isAdmin)
      res.render('admin', {
        ...processEJSData(req),
        navStatus: 'admin/dashboard',
        docSubTitle: 'Dashboard',
      });
    else res.redirect('/');
  }
}

export default new AdminController();
