// import chokidar from 'chokidar';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx/xlsx.mjs';
import _fs from './fsHandles.js';
import * as THEMIS_DIR from './getDirs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PROBLEMS_DIR, RANKING_DIR, TASKS_DIR } = THEMIS_DIR;
// const watcher = chokidar.watch(join(__dirname, 'resources', '_rankings'), {
// 	ignored: /(^|[\/\\])\../,
// 	persistent: true,
// });

// watcher
// 	.on('add', (path) => console.log(`File ${path} has been added`))
// 	.on('change', (path) => console.log(`File ${path} has been changed`))
// 	.on('unlink', (path) => console.log(`File ${path} has been removed`));

XLSX.set_fs(fs);

config();

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

export const getTaskList = () => {
	if (!_fs.dir.read(TASKS_DIR).length) return [];

	const names = _fs.dir.read(TASKS_DIR);
	const problems = [];

	names.forEach((name, idx) => problems.push(name));
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
	const { data } = rankings[0];
	const { Props, Sheets } = data;

	const { ModifiedDate } = Props;
	const scores = Sheets['Tổng hợp điểm'];

	const size = getTaskList().length;
	const newDate = ModifiedDate.toString().split('');

	const scoreList = Object.entries(scores);
	scoreList.pop();

	let statusList = scoreList.slice(2 + size + 1);
	const status = [];
	for (let i = 0; i < statusList.length; i++) {
		if (statusList[i][1]?.r) {
			const name = statusList[i][1].v;
			const list = [];

			for (let j = i + 1; j < statusList.length; j++)
				if (!statusList[j][1]?.r) {
					list.push(statusList[j][1].v);
				} else {
					i = j - 1;
					break;
				}

			status.push({ name, list });
		}
	}

	return {
		ModifiedDate: newDate,
		tasks: scoreList.slice(2, 2 + size).map((_) => _[1].v),
		status,
		scores,
	};
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
