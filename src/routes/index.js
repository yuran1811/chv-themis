import about from './about.js';
import admin from './admin.js';
import err from './err.js';
import home from './home.js';
import problems from './problems.js';
import ranking from './ranking.js';
import users from './users.js';
import submitCode from './submit-code.js';

const route = (app) => {
	app.use('/users', users);
	app.use('/admin', admin);
	app.use('/problems', problems);
	app.use('/ranking', ranking);
	app.use('/about', about);
	app.use('/submit-code', submitCode);
	app.use('/', home);
	app.use('/*', err);
};

export default route;
