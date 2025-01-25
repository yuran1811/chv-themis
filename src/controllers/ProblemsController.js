import { getProblemList, processEJSData } from '../utils/index.js';

class ProblemsController {
  // [GET] /problems/list
  list(req, res, next) {
    res.render('problems', {
      ...processEJSData(req),
      navStatus: 'problems',
      docSubTitle: 'Problems',
      problems: getProblemList(),
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
