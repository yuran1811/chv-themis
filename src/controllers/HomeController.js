import * as utils from '../tools/utils.js';

class HomeController {
	// [GET] /home
	show(req, res, next) {
		res.render('home', {
			...utils.defaultEJS,
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
		});
	}
}

export default new HomeController();
