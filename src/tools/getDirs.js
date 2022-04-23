import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

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
