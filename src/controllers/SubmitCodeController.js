import { resolve } from 'path';
import _fs from '../tools/fsHandles.js';
import * as THEMIS_DIR from '../tools/getDirs.js';
import * as utils from '../tools/utils.js';

class SubmitCodeController {
  // [GET] /submit-code
  show(req, res, next) {
    res.render('submit-code', {
      ...utils.defaultEJS,
      navStatus: 'submit-code',
      isAuth: utils.getAuthStatus(req),
      user: utils.getAuthUser(req),
      tasks: utils.getTaskList(),
    });
  }

  // [POST] /submit-code/:user
  submit(req, res, next) {
    const { submission, problem, lang } = req.body;

    _fs.f.write(resolve(THEMIS_DIR.SUBMISSIONS_DIR, utils.cvertSubmissionName(req, problem, lang)), submission);

    res.redirect('/');
  }
}

export default new SubmitCodeController();
