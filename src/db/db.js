import crypto from 'crypto';
import { mkdirp } from 'mkdirp';
import fs from 'node:fs';
import sqlite3 from 'sqlite3';

mkdirp.sync('./db');

const db = new sqlite3.Database('./db/chv-themis.db');

db.serialize(() => {
  // create users table
  db.run(
    'CREATE TABLE IF NOT EXISTS users (\
      id INTEGER PRIMARY KEY AUTOINCREMENT,\
      username TEXT UNIQUE NOT NULL,\
      hashed_password BLOB,\
      salt BLOB\
    )',
  );

  // import user from accounts.json
  try {
    const rawData = fs.readFileSync('./db/data/accounts.json', 'utf8');
    const data = rawData ? JSON.parse(rawData) : [];

    data.forEach((account) => {
      const salt = crypto.randomBytes(16);

      db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        account.username,
        crypto.pbkdf2Sync(account.password, salt, 310000, 32, 'sha256'),
        salt,
      ]);
    });
  } catch (err) {
    console.error('[db] - Error reading or parsing JSON:', err);
  }
});

export default db;
