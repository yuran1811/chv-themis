import { resolve } from 'path';

import _fs from '../utils/fsHandles.js';
import * as THEMIS_DIR from '../utils/getDirs.js';
import { cvertSubmissionName, getTaskList, processEJSData } from '../utils/index.js';

class SubmitCodeController {
  // [GET] /submit
  index(req, res, next) {
    if (!req?.user) return res.redirect('/auth/login');

    res.render('submit-code', {
      ...processEJSData(req),
      navStatus: 'submit-code',
      docSubTitle: 'Submit',
      tasks: getTaskList(),
    });
  }

  // [POST] /submit/:user
  submit(req, res, next) {
    const { submission, problem, lang } = req.body;

    _fs.f.write(resolve(THEMIS_DIR.SUBMISSIONS_DIR, cvertSubmissionName(req, problem, lang)), submission);

    res.redirect('/');
  }
}

export default new SubmitCodeController();
