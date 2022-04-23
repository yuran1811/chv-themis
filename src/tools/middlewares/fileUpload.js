import { config } from 'dotenv';
import multer from 'multer';
import * as THEMIS_DIR from '../getDirs.js';
import * as utils from '../utils.js';

config();

const { SUBMISSIONS_DIR } = THEMIS_DIR;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, SUBMISSIONS_DIR);
	},
	filename: (req, file, cb) => {
		file.newFileName = file.originalname.replace('.cpp', '');
		cb(null, utils.cvertSubmissionName(req, file));
	},
});

const fileUpload = multer({ storage: storage });

export default fileUpload;
