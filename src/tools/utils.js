import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx/xlsx.mjs';
import _fs from './fsHandles.js';
import * as THEMIS_DIR from './getDirs.js';

config();

XLSX.set_fs(fs);

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PROBLEMS_DIR, RANKING_DIR } = THEMIS_DIR;

const getRowIndex = (c, sz) => {
	const times = sz / 26;
	const r = sz % 26;
	let rowIdx = '';
	for (let i = 0; i < sz; i++) {}
	return rowIdx;
};

export const getYear = () => new Date().getFullYear();
export const getMonth = () => new Date().getMonth();
export const getDate = () => new Date().getDate();

export const getMs = (time) => {
	const [h, m, s] = time.split(':');
	return (+h * 60 * 60 + +m * 60 + +s) * 1000;
};

export const getAuthStatus = (req) =>
	cookieParser.JSONCookies(req.cookies.isAuth || 0) || 0;

export const getAuthUser = (req) =>
	cookieParser.JSONCookies(req.cookies.user || '') || 'null';

export const getProblemList = () => {
	if (!_fs.dir.read(PROBLEMS_DIR).length) return [];

	const names = _fs.dir.read(PROBLEMS_DIR);
	const links = names.map((_) => `/_problems/${_}`);
	const problems = [];

	names.forEach((name, idx) => problems.push({ name, link: links[idx] }));
	return problems;
};

export const getRankingList = () => {
	if (!_fs.dir.read(RANKING_DIR).length) return [];

	const names = _fs.dir.read(RANKING_DIR);
	const links = names.map((_) => resolve(RANKING_DIR, _));
	const rankings = [];

	names.forEach((name, idx) =>
		rankings.push({
			name,
			data: XLSX.readFile(links[idx], { type: 'file' }),
		})
	);
	return rankings;
};

export const getRankingData = (rankings) => {
	const size = rankings.length;
	return rankings.map((rank) => {
		const { data } = rank;
		const { Props, Sheets } = data;

		const { ModifiedDate } = Props;
		const scores = Sheets['Tổng hợp điểm'];

		return getRowIndex('B', size);
	});
};

export const getUserAccounts = (req) => {
	const filePath = resolve(__dirname, '../', 'db', 'accounts.json');
	const accounts = JSON.parse(_fs.f.read(filePath));
	return accounts;
};

export const cvertSubmissionName = (req, file) =>
	`[${req.params.user}][${file.newFileName}].cpp`;

export const defaultEJS = {
	year: getYear(),
	navStatus: 'home',
	isAuth: 0,
	user: '',
};

console.log(getRowIndex('B', 25));
