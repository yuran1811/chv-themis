import * as fs from 'fs';
import { basename, resolve } from 'path';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import * as XLSX from 'xlsx/xlsx.mjs';

import _fs from './fsHandles.js';
import * as THEMIS_DIR from './getDirs.js';

XLSX.set_fs(fs);
XLSX.set_cptable(cpexcel);

const { LOGS_DIR, RANKING_DIR, RANKING_MODE, PROBLEMS_DIR, TASKS_DIR, CONTESTANTS_DIR, SUBMISSIONS_DIR } = THEMIS_DIR;

export const palettes = {
  level: ['#fff0', '#f77', '#ffa71c', '#fff863', '#7f7'],
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

export const getYear = () => new Date().getFullYear();
export const getMonth = () => new Date().getMonth();
export const getDate = () => new Date().getDate();
export const getMs = (time) => {
  const [h, m, s] = time.split(':');
  return (+h * 60 ** 2 + +m * 60 + +s) * 1000;
};

export const getLevelColor = (level) => palettes.level[level];

export const cvertSubmissionName = (req, file, lang = 'cpp') =>
  `[${req.params?.user || req?.user?.username || 'unknown'}][${file}].${lang}`;

export const setRankColor = (status) => {
  const rankList = palettes.rank.list;

  status.sort((a, b) => b.score - a.score);
  status.forEach((_, idx) => {
    if (idx < rankList.length) _.color = rankList[idx];
    else _.color = rankList[rankList.length - 1];
  });
};

export const getXLSXFiles = (dir = RANKING_DIR) => _fs.dir.read(dir).filter((_) => _.includes('.xlsx'));

export const getRankOnl = () => {
  const rankings = [];
  const names = _fs.dir.read(LOGS_DIR);
  const links = names.map((_) => resolve(LOGS_DIR, _));

  names.forEach((name, idx) => {
    const data = _fs.f.read(links[idx], 'utf-8');
    if (!data || !data.length) return;

    rankings.push({
      name,
      data: data.toString().split(/\r?\n/),
    });
  });

  let contestants = {};
  rankings.forEach((_) => {
    const idx1 = _.name.indexOf('][');
    const idx2 = _.name.indexOf('.cpp');

    const fileUser = _.name.slice(1, idx1);
    const fileName = _.name.slice(idx1 + 2, idx2 - 1);

    if (!contestants.hasOwnProperty(fileUser)) contestants = { ...contestants, [fileUser]: {} };

    contestants[fileUser][fileName] = +_.data[0].slice(_.data[0].indexOf(':') + 2);
    isNaN(contestants[fileUser][fileName]) && (contestants[fileUser][fileName] = 0);
  });

  const list = Object.entries(contestants);
  const status = list.map((_) => {
    const tasks = getTaskList();
    const list = tasks.map((task) => {
      const _score = _[1].hasOwnProperty(task) ? _[1][task] : 0;
      return [_score, getLevelColor(Math.floor(_score / 25))];
    });
    const totScore = list.reduce((sum, _) => sum + _[0], 0);
    list.push([totScore, getLevelColor(Math.floor(totScore / (25 * (tasks.length + 1))))]);

    return {
      name: _[0],
      list,
      totScore,
      color: 'red',
    };
  });

  setRankColor(status);

  return { status, fail: 0 };
};
export const getRankOff = () => {
  const status = [];
  const rankings = [];
  const contestants = getContestantList();
  const rankFiles = getXLSXFiles();
  const links = rankFiles.map((_) => resolve(RANKING_DIR, _));

  rankFiles.forEach((name, idx) =>
    rankings.push({
      name,
      data: XLSX.readFile(links[idx], { type: 'file', cellDates: true }),
    }),
  );

  const cvertData = (a, i) => {
    if (isNaN(+a[i][1].v) && !contestants.includes(a[i][1].v.toString().toLowerCase())) {
      a[i][1].v = 0;
      a[i][1].w = '0.00';
      a[i][1].t = 'n';

      delete a[i][1].r;
      delete a[i][1].h;
    }
  };

  const { data } = rankings[0];
  if (!data?.Sheets) return { status, fail: 1 };

  const { Sheets } = data;
  if (!Sheets['Tổng hợp điểm']) return { status, fail: 1 };

  const scores = Sheets['Tổng hợp điểm'];
  const scoreList = Object.entries(scores);
  scoreList.pop();

  let statusList = scoreList.slice(2 + getTaskList().length + 1);

  for (let i = 0; i < statusList.length; i++) {
    cvertData(statusList, i);

    if (statusList[i][1]?.r) {
      const name = statusList[i][1].v;
      const list = [];

      for (let j = i + 1; j < statusList.length; j++) {
        cvertData(statusList, j);
        if (!statusList[j][1]?.r) list.push(+statusList[j][1].v.toPrecision(2));
        else {
          i = j - 1;
          break;
        }
      }

      const score = +(list.reduce((sum, _) => sum + _, 0) - list[list.length - 1]).toPrecision(2);
      status.push({ name, list, score });
    }
  }

  setRankColor(status);

  return { status, fail: 0 };
};
export const getRankOffXLSX = () => {
  const status = [];
  const rankings = [];
  const rankFiles = getXLSXFiles();
  const links = rankFiles.map((_) => resolve(RANKING_DIR, _));

  rankFiles.forEach((name, idx) =>
    rankings.push({
      name,
      data: XLSX.readFile(links[idx], { type: 'file', cellDates: true }),
    }),
  );

  const { data } = rankings[0];
  if (!data?.Sheets) return { status, fail: 1 };

  const { Sheets } = data;
  if (!Sheets['Tổng hợp điểm']) return { status, fail: 1 };

  const scoresSheet = Sheets['Tổng hợp điểm'];
  const scoresData = XLSX.utils.sheet_to_json(scoresSheet);
  const userData = scoresData.map((item) => {
    const list = Object.values(item);
    return list.map((_, i) => {
      if (i) isNaN(_) && (_ = 0);
      return _;
    });
  });

  userData.forEach((_) => {
    const name = _.shift();
    const score = _.slice(0, _.length - 1).reduce((sum, _) => sum + _, 0);
    status.push({
      name,
      list: _,
      score,
    });
  });

  setRankColor(status);

  return { status, fail: 0 };
};
export const getRankingData = () => {
  const mode = RANKING_MODE;
  const rankData = (mode == 'off' && getRankOff()) ||
    (mode == 'onl' && getRankOnl()) || {
      status: [],
      fail: 0,
    };
  const nowTime = new Date();
  let ModifiedDate = nowTime.toLocaleTimeString() + ' - ' + nowTime.toLocaleDateString();

  ((dir) => {
    const xlsxs = getXLSXFiles(dir);
    const logs = _fs.dir.read(LOGS_DIR);
    if ((dir === RANKING_DIR && !xlsxs.length) || (dir === LOGS_DIR && !logs.length)) return;

    const { mtime } = _fs.f.stat(resolve(dir, dir === LOGS_DIR ? LOGS_DIR : xlsxs[0]));
    ModifiedDate = mtime.toLocaleTimeString() + ' - ' + mtime.toLocaleDateString();
  })(mode === 'off' ? RANKING_DIR : LOGS_DIR);

  return {
    ModifiedDate,
    tasks: getTaskList(),
    ...rankData,
  };
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
  if (!user) return [];

  const path = resolve(SUBMISSIONS_DIR, 'Logs');
  const files = _fs.dir.read(path);
  const logList = files.map((_) => {
    const { fileUser, fileName, logPath, score, logs } = getLogData(path, _);
    const isUser = user?.username === fileUser;

    return {
      user: user?.username || 'unknown',
      name: isUser ? fileName : '',
      link: isUser ? logPath : '',
      score: isUser ? score : 0,
      color: isUser ? getLevelColor(Math.floor(score / 25)) : '',
      content: isUser ? logs : [],
    };
  });
  return logList;
};

export const getProblemList = () => {
  const names = _fs.dir.read(PROBLEMS_DIR);
  if (!names.length) return [];

  const links = names.map((_) => `/${basename(PROBLEMS_DIR)}/${_}`);
  const problems = [];

  names.forEach((name, idx) =>
    problems.push({ name, link: links[idx], filetype: name.includes('.') ? name.split('.').pop() : '' }),
  );

  return problems;
};

export const getContestantList = () => {
  const contestants = _fs.dir.read(CONTESTANTS_DIR);
  if (!contestants.length) return [];

  return contestants.map((_) => _.toLocaleLowerCase());
};

export const getTaskList = () => {
  const names = _fs.dir.read(TASKS_DIR);
  if (!names.length) return [];

  const problems = [];

  names.forEach((name, idx) => problems.push(name));
  return problems;
};

export const processEJSData = (req) => {
  const defaultEJS = {
    navStatus: '',
  };

  const user = req?.user ?? null;

  return {
    ...defaultEJS,
    isAuth: !!user,
    isAdmin: !!req?.user?.isAdmin,
    user,
  };
};
