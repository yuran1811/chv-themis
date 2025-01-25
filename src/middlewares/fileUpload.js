import multer from 'multer';

import { SUBMISSIONS_DIR } from '../utils/getDirs.js';
import { cvertSubmissionName } from '../utils/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SUBMISSIONS_DIR);
  },
  filename: (req, file, cb) => {
    if (!req.params?.user || !req?.user?.username) return cb(new Error('User not found'), null);
    if (req.params.user !== req.user.username) return cb(new Error('User not match'), null);

    const filename = file.originalname.replace('.cpp', '');
    cb(null, cvertSubmissionName(req, filename));
  },
});

const fileUpload = multer({ storage: storage });

export default fileUpload;
