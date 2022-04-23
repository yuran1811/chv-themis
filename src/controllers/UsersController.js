import { getMs, getUserAccounts } from '../tools/utils.js';

class UsersController {
	// [POST] /users/auth/
	auth(req, res, next) {
		const accounts = getUserAccounts();
		const { name, pass } = req.body;
		const isAuth = accounts.some((_) => _.name === name && _.pass === pass);
		const expireTime = getMs('6:00:00');

		if (isAuth) {
			res.cookie('isAuth', 1, {
				expires: expireTime,
			});
			res.cookie('user', name, {
				expires: expireTime,
			});
		} else {
			res.cookie('isAuth', 0);
			res.cookie('user', 'null');
		}
		res.redirect('/');
	}
}

export default new UsersController();
