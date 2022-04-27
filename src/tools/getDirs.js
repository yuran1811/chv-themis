import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import _fs from './fsHandles.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROBLEMS_DIR =
	process.env.PROBLEMS_DIR || resolve(__dirname, '../public/_problems');
export const SUBMISSIONS_DIR =
	process.env.SUBMISSIONS_DIR || resolve(__dirname, '../resources/uploads');
export const RANKING_DIR =
	process.env.RANKING_DIR || resolve(__dirname, '../resources/_rankings');
export const TASKS_DIR =
	process.env.TASKS_DIR || resolve(__dirname, '../resources/tasks');
export const LOGS_DIR = resolve(SUBMISSIONS_DIR, 'Logs');

(() => {
	[PROBLEMS_DIR, SUBMISSIONS_DIR, RANKING_DIR, TASKS_DIR, LOGS_DIR].forEach(
		(_) => {
			if (!_fs.dir.exist(_)) _fs.dir.md(_);
		}
	);
	if (_fs.dir.read(RANKING_DIR).length === 0) {
		console.log('no rank.xlsz, created');
		_fs.f.write(resolve(RANKING_DIR, 'rank#1.xlsx'), '');
	}
})();
