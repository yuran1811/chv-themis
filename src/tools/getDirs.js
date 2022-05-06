import { config } from 'dotenv';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import * as XLSX from 'xlsx/xlsx.mjs';
import _fs from './fsHandles.js';

XLSX.set_fs(fs);
XLSX.set_cptable(cpexcel);

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const RANKING_MODE = process.env.RANKING_MODE || 'off';

export const PROBLEMS_DIR =
	process.env.PROBLEMS_DIR || resolve(__dirname, '../public/_problems');

export const SUBMISSIONS_DIR =
	process.env.SUBMISSIONS_DIR || resolve(__dirname, '../resources/uploads');

export const RANKING_DIR =
	process.env.RANKING_DIR || resolve(__dirname, '../resources/_rankings');

export const CONTESTANTS_DIR =
	process.env.CONTESTANTS_DIR ||
	resolve(__dirname, '../resources/contestants');

export const TASKS_DIR =
	process.env.TASKS_DIR || resolve(__dirname, '../resources/tasks');

export const LOGS_DIR = resolve(SUBMISSIONS_DIR, 'Logs');

(() => {
	[
		PROBLEMS_DIR,
		SUBMISSIONS_DIR,
		RANKING_DIR,
		CONTESTANTS_DIR,
		TASKS_DIR,
		LOGS_DIR,
	].forEach((_) => {
		if (!_fs.dir.exist(_)) _fs.dir.md(_);
	});

	const rankDir = _fs.dir.read(RANKING_DIR);
	if (!rankDir.length || !rankDir.some((_) => _.includes('.xlsx'))) {
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.aoa_to_sheet([['Mã thí sinh']]);
		XLSX.utils.book_append_sheet(wb, ws, 'Tổng hợp điểm');
		XLSX.writeFileXLSX(wb, resolve(RANKING_DIR, 'ranking.xlsx'));
	}
})();
