import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import _fs from './fsHandles.js';
import * as THEMIS_DIR from './getDirs.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PROBLEMS_DIR } = THEMIS_DIR;

export const getYear = () => new Date().getFullYear();
export const getMonth = () => new Date().getMonth();
export const getDate = () => new Date().getDate();

export const getMs = (time) => {
	const [h, m, s] = time.split(':');
	return new Date(Date.now() + (h * 60 * 60 + m * 60 + s) * 1000);
};

export const getAuthStatus = (req) =>
	cookieParser.JSONCookies(req.cookies.isAuth || 0);
export const getAuthUser = (req) =>
	cookieParser.JSONCookies(req.cookies.user || 0);

export const getProblemList = () => {
	if (!_fs.dir.read(PROBLEMS_DIR).length) return [];
	const names = _fs.dir.read(PROBLEMS_DIR);
	const links = names.map((_) => `/_problems/${_}`);
	const problems = [];
	names.forEach((name, idx) =>
		problems.push({
			name,
			link: links[idx],
		})
	);
	return problems;
};

export const getUserAccounts = (req) => {
	const filePath = resolve(__dirname, '../', 'db', 'accounts.json');
	const accounts = JSON.parse(_fs.f.read(filePath));
	return accounts;
};

export const cvertSubmissionName = (req, file) =>
	`[${req.params.user}][${file.originalname}].cpp`;

export const defaultEJS = {
	year: getYear(),
	navStatus: 'home',
	isAuth: 0,
	user: '',
};
