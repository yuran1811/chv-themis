import fs from 'fs';

const _fs = {
  f: {
    write: (file, data, options = {}) => {
      fs.writeFileSync(file, data, options);
    },
    read: (path, options) => {
      try {
        return fs.readFileSync(path, options);
      } catch (error) {
        console.log('[fsHandles.f.read] Error:', error);
        return '';
      }
    },
    copy: (src, dest) => {
      fs.copyFileSync(src, dest);
    },
    rm: (path, options = {}) => {
      fs.rmSync(path, options);
    },
    stat: (path) => {
      return fs.statSync(path);
    },
  },
  dir: {
    exist: (directory) => fs.existsSync(directory),
    read: (directory) => {
      try {
        return fs.readdirSync(directory);
      } catch (error) {
        console.log('[fsHandles.dir.read] Error:', error);
        return [];
      }
    },
    md: (directory, options = { recursive: true }) => {
      fs.mkdirSync(directory, options);
    },
    rd: (directory, options = { recursive: true, force: true }) => {
      fs.rmSync(directory, options);
    },
  },
};

export default _fs;
