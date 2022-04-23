import { getMs, getUserAccounts } from '../tools/utils.js';

class UsersController {
	// [POST] /users/auth/
	auth(req, res, next) {
		const accounts = getUserAccounts();
		const { name, pass } = req.body;
		const isAuth = accounts.some((_) => _.name === name && _.pass === pass);
		const maxAge = getMs('00:01:00');

		if (isAuth) {
			res.cookie('isAuth', 1, { maxAge });
			res.cookie('user', name, { maxAge });
		} else {
			res.cookie('isAuth', 0);
			res.cookie('user', 'null');
		}
		res.redirect('/');
	}
}

export default new UsersController();
