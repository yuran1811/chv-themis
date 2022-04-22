import * as utils from '../tools/utils.js';

class ProblemsController {
	// [GET] /problems/list
	list(req, res, next) {
		res.render('problems', {
			...utils.defaultEJS,
			navStatus: 'problems',
			problems: utils.getProblemList(),
			isAuth: utils.getAuthStatus(req),
			user: utils.getAuthUser(req),
		});
	}

	//  [POST] /problems/submit/:user
	submit(req, res, next) {
		const files = req.files;
		if (!files) {
			const error = new Error('Please choose files');
			error.httpStatusCode = 400;
			return next(error);
		}
		res.redirect('/');
	}
}

export default new ProblemsController();
