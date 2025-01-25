import createError from 'http-errors';

import { processEJSData } from '../utils/index.js';
import about from './about.js';
import admin from './admin.js';
import auth from './auth.js';
import home from './home.js';
import problems from './problems.js';
import profile from './profile.js';
import ranking from './ranking.js';
import submitCode from './submit-code.js';

const routing = (app) => {
  app.use('/auth', auth);
  app.use('/admin', admin);
  app.use('/profile', profile);
  app.use('/submit', submitCode);
  app.use('/problems', problems);
  app.use('/ranking', ranking);
  app.use('/about', about);
  app.use('/', home);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // Error handler
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('err', { ...processEJSData(req), error: err.message });
  });
};

export default routing;
