import crypto from 'crypto';
import { Router } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import AuthController from '../controllers/AuthController.js';
import db from '../db/db.js';

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
      if (err) return cb(err);
      if (!row) return cb(null, false, { message: 'Incorrect username or password.' });

      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) return cb(err);

        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword))
          return cb(null, false, { message: 'Incorrect username or password.' });

        return cb(null, { ...row, isAdmin: row.username === 'admin' });
      });
    });
  }),
);

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session. This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session. The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * query records and render elements, that information is stored in the session.
 */
passport.serializeUser(function (user, cb) {
  process.nextTick(() => cb(null, { id: user.id, username: user.username, isAdmin: user.isAdmin }));
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(() => cb(null, user));
});

const router = Router();

router.get('/login', AuthController.login);

/** [POST] /auth/login/password
 *
 * This route authenticates the user by verifying a username and password.
 *
 * A username and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /auth/login` route. The username and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * username and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 *
 * @openapi
 * /auth/login/password:
 *   post:
 *     summary: Log in using a username and password
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: number
 *     responses:
 *       "302":
 *         description: Redirect.
 */
router.post(
  '/login/password',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/profile',
    failureRedirect: '/auth/login',
    failureMessage: true,
  }),
);

router.get('/signup', AuthController.signup);
router.post('/signup', AuthController.signupHandler);

router.post('/logout', AuthController.logout);

export default router;
