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
const { PROBLEMS_DIR, RANKING_DIR, TASKS_DIR, SUBMISSIONS_DIR, LOGS_DIR } =
	THEMIS_DIR;
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

export const palettes = {
	problem: {
		list: [
			'OK',
			'TIME_LIMIT_EXCEEDED',
			'MEMORY_LIMIT_EXCEEDED',
			'COMPILATION_ERROR',
			'RUNTIME_ERROR',
			'FAILED',
			'WRONG_ANSWER',
		],
		status: {
			OK: {
				color: '#00a92a',
				text: 'AC',
			},
			TIME_LIMIT_EXCEEDED: {
				color: '#fff863',
				text: 'TLE',
			},
			MEMORY_LIMIT_EXCEEDED: {
				color: '#ffa71c',
				text: 'MLE',
			},
			COMPILATION_ERROR: {
				color: '#ffa71c',
				text: 'CE',
			},
			RUNTIME_ERROR: {
				color: '#ffa71c',
				text: 'RE',
			},
			FAILED: {
				color: 'red',
				text: 'FAILED',
			},
			WRONG_ANSWER: {
				color: 'red',
				text: 'WA',
			},
			OTHER: {
				color: 'lightgrey',
			},
		},
	},
	rank: {
		list: ['#f00', '#fb5', '#f8f', '#aaf', '#7db', '#7f7', '#ccc'],
		codeforce: {
			newbie: '#ccc',
			pupil: '#7f7',
			specialist: '#7db',
			expert: '#aaf',
			'candidate master': '#f8f',
			master: '#fc8',
			'international master': '#fb5',
			grandmaster: '#f77',
			'international grandmaster': '#f33',
			'legendary grandmaster': '#f00',
		},
	},
};

export const cvertSubmissionName = (req, file, lang = 'cpp') =>
	`[${req.params.user}][${file}].${lang}`;

export const getYear = () => new Date().getFullYear();
export const getMonth = () => new Date().getMonth();
export const getDate = () => new Date().getDate();
export const getMs = (time) => {
	const [h, m, s] = time.split(':');
	return (+h * 60 * 60 + +m * 60 + +s) * 1000;
};

export const getLogData = (path, file) => {
	const idx1 = file.indexOf('][');
	const idx2 = file.indexOf('.cpp');

	const fileUser = file.slice(1, idx1);
	const fileName = file.slice(idx1 + 2, idx2 - 1);

	const logPath = resolve(path, file);
	const logContent = _fs.f.read(logPath, 'utf-8').toString().split(/\r?\n/);

	const score = logContent[0].slice(logContent[0].indexOf(':') + 2);

	const logs = [...logContent];
	logs.splice(0, 4);
	logs.pop();

	return { fileUser, fileName, logPath, score, logs };
};
export const getLogList = (user) => {
	const path = resolve(SUBMISSIONS_DIR, 'Logs');
	const files = _fs.dir.read(path);
	return files.map((_) => {
		const { fileUser, fileName, logPath, score, logs } = getLogData(
			path,
			_
		);
		if (user === fileUser) {
			return {
				user,
				name: fileName,
				link: logPath,
				score,
				content: logs,
			};
		}
	});
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

export const getRankOnl = (rankings) => {
	const names = _fs.dir.read(LOGS_DIR);
	const links = names.map((_) => resolve(LOGS_DIR, _));

	names.forEach((name, idx) =>
		rankings.push({
			name,
			data: XLSX.readFile(links[idx], { type: 'file' }),
		})
	);
};
export const getRankOff = (rankings) => {
	const names = _fs.dir.read(RANKING_DIR);
	const links = names.map((_) => resolve(RANKING_DIR, _));

	names.forEach((name, idx) =>
		rankings.push({
			name,
			data: XLSX.readFile(links[idx], { type: 'file' }),
		})
	);
};
export const getRankingList = (mode = 'off') => {
	if (mode == 'off' && !_fs.dir.read(RANKING_DIR).length) return [];
	if (mode == 'onl' && !_fs.dir.read(LOGS_DIR).length) return [];

	const rankings = [];

	if (mode == 'off') getRankOff(rankings);
	if (mode == 'onl') getRankOnl(rankings);
	return rankings;
};
export const getRankingData = (rankings) => {
	const { data } = rankings[0];
	if (!data?.Sheets || !data?.Props) return { fail: 1 };

	const { Props, Sheets } = data;
	const { ModifiedDate } = Props;

	if (!Sheets['Tổng hợp điểm']) return { fail: 1 };
	const scores = Sheets['Tổng hợp điểm'];

	const size = getTaskList().length;
	const newDate = ModifiedDate.toString().split('');

	const scoreList = Object.entries(scores);
	scoreList.pop();

	let statusList = scoreList.slice(2 + size + 1);
	const status = [];

	for (let i = 0; i < statusList.length; i++) {
		if (statusList[i][1].v === 'Chưa chấm') {
			statusList[i][1].v = 0;
			statusList[i][1].w = '0.00';
			statusList[i][1].t = 'n';
			statusList[i][1].r = undefined;
			delete statusList[i][1].r;
			delete statusList[i][1].h;
		}

		if (statusList[i][1]?.r) {
			const name = statusList[i][1].v;
			const list = [];
			let score = 0;

			for (let j = i + 1; j < statusList.length; j++)
				if (!statusList[j][1]?.r) {
					list.push(statusList[j][1].v);
					score += +statusList[j][1].v;
				} else {
					i = j - 1;
					break;
				}

			status.push({ name, list, score });
		}
	}

	console.log(scoreList);

	status.sort((a, b) => b.score - a.score);
	status.forEach((_, idx) => {
		if (idx < palettes.rank.list.length) _.color = palettes.rank.list[idx];
		else _.color = palettes.rank.list[palettes.rank.list.length - 1];
	});

	return {
		ModifiedDate: newDate,
		tasks: scoreList.slice(2, 2 + size).map((_) => _[1].v),
		status,
		scores,
		fail: 0,
	};
};

export const getUserAccounts = (req) => {
	const filePath = resolve(__dirname, '../', 'db', 'accounts.json');
	const accounts = JSON.parse(_fs.f.read(filePath));
	return accounts;
};

export const defaultEJS = {
	year: getYear(),
	navStatus: 'home',
	isAuth: 0,
	user: '',
};
