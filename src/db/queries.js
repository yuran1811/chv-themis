import crypto from 'crypto';

import { processEJSData } from '../utils/index.js';
import db from './db.js';

export const updateUserPassword = async (req, oldPassword, newPassword, res, next) => {
  try {
    if (!req?.user) return next(new Error('Invalid request'));

    const user = req.user;

    db.each(
      `SELECT * FROM users WHERE username = ? AND id = ?`,
      [user.username, user.id],
      function (err, row) {
        if (err) return next(err);
        if (!row) return next(new Error('Invalid password'));

        const hashedOldPassword = crypto.pbkdf2Sync(oldPassword, row.salt, 310000, 32, 'sha256');
        if (hashedOldPassword.toString('hex') !== row.hashed_password.toString('hex')) {
          return next(new Error('Old password not match'));
        }

        const salt = crypto.randomBytes(16);
        const hashedNewPassword = crypto.pbkdf2Sync(newPassword, salt, 310000, 32, 'sha256');

        db.run(
          `UPDATE users SET hashed_password = ?, salt = ? WHERE username = ?`,
          [hashedNewPassword, salt, user.username],
          function (err) {
            if (err) return next(err);

            return res.render('profile', {
              ...processEJSData(req),
              navStatus: 'profile',
              docSubTitle: 'Profile',
              success: 'Password changed successfully!',
            });
          },
        );
      },
      function (err, count) {
        if (err) return next(err);
        if (count !== 1) return next(new Error('Invalid password'));
      },
    );
  } catch (error) {
    next(error);
  }
};
