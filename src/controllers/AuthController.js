import crypto from 'crypto';

import { processEJSData } from '../utils/index.js';
import db from '../db/db.js';

class AuthController {
  // [GET] /auth/login
  login(req, res) {
    if (req?.user) return res.redirect('/profile');
    res.render('signinup', { ...processEJSData(req), isSignIn: true });
  }

  // [GET] /auth/signup
  signup(req, res) {
    if (req?.user) return res.redirect('/profile');
    res.render('signinup', { ...processEJSData(req), isSignIn: false });
  }

  // [POST] /auth/signup
  signupHandler(req, res, next) {
    if (req.body.username.trim() === '' || req.body.password.trim() === '' || req.body.confirmedPassword.trim() === '')
      return res.redirect('/auth/signup');

    if (req.body.password !== req.body.confirmedPassword)
      return res.render('signinup', { ...processEJSData(req), error: 'Passwords do not match!' });

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) return next(err);

      db.run(
        'INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
        [req.body.username, hashedPassword, salt],
        function (err) {
          if (err) return next(err);

          const user = {
            id: this.lastID,
            username: req.body.username,
          };
          req.login(user, function (err) {
            if (err) return next(err);

            res.redirect('/profile');
          });
        },
      );
    });
  }

  // [POST] /auth/logout
  logout(req, res, next) {
    if (!req?.user) return res.redirect('/');

    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  }
}

export default new AuthController();
