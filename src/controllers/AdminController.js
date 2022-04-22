import * as utils from '../tools/utils.js';

class AdminController {
	// [GET] /admin/
	admin(req, res, next) {
		res.render('admin', {
			...utils.defaultEJS,
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
		});
	}
}

export default new AdminController();
