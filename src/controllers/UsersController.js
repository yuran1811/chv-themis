import { getMs, getUserAccounts } from '../tools/utils.js';

class UsersController {
	// [POST] /users/auth/
	auth(req, res, next) {
		const accounts = getUserAccounts();
		const { name, pass } = req.body;
		const isAuth = accounts.some((_) => _.name === name && _.pass === pass);

		if (isAuth) {
			res.cookie('isAuth', 1, {
				expires: getMs('6:00:00'),
			});
			res.cookie('user', name, {
				expires: getMs('6:00:00'),
			});
		} else {
			res.cookie('isAuth', 0);
			res.cookie('user', '');
		}
		res.redirect('/');
	}
}

export default new UsersController();
