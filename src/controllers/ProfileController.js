import { processEJSData } from '../utils/index.js';
import { updateUserPassword } from '../db/queries.js';

class ProfileController {
  // [GET] /profile
  index(req, res, next) {
    res.render('profile', {
      ...processEJSData(req),
      navStatus: 'profile',
      docSubTitle: 'Profile',
    });
  }

  // [POST] /profile/change-password
  changePassword(req, res, next) {
    if (!req?.user || !req?.body) next(new Error('Invalid request'));
    if (!req.body?.oldPassword || !req.body?.newPassword) next(new Error('Do not leave the fields blank'));
    if (!req.body.oldPassword?.toString().trim().length || !req.body.newPassword?.toString().trim().length)
      next(new Error('Do not leave the fields blank!'));

    const { oldPassword, newPassword } = req.body;

    updateUserPassword(req, oldPassword, newPassword, res, next);
  }
}

export default new ProfileController();
