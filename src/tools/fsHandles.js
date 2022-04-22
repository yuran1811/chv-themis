import fs from 'fs';

const _fs = {
	f: {
		write: (file, data, options = {}) => {
			fs.writeFileSync(file, data, options);
		},
		read: (path) => {
			return fs.readFileSync(path);
		},
		copy: (src, dest) => {
			fs.copyFileSync(src, dest);
		},
		rm: (path, options = {}) => {
			fs.rmSync(path, options);
		},
	},
	dir: {
		exist: (directory) => fs.existsSync(directory),
		read: (directory) => fs.readdirSync(directory),
		md: (directory, options = { recursive: true }) => {
			fs.mkdirSync(directory, options);
		},
		rd: (directory, options = { recursive: true, force: true }) => {
			fs.rmSync(directory, options);
		},
	},
};

export default _fs;
