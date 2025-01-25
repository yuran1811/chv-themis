import { ensureLoggedIn as el } from 'connect-ensure-login';

export const ensureLoggedIn = el('/');

export default ensureLoggedIn;
