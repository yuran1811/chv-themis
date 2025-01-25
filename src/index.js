import SQLiteStoreContructor from 'connect-sqlite3';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import routing from './routes/index.js';

dotenvConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 1811;

const SQLiteStore = SQLiteStoreContructor(expressSession);
const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));

app.use(express.static(join(__dirname, '../resources')));
app.use(express.static(join(__dirname, '../public/static')));
app.use(express.static(join(__dirname, '../node_modules')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.PASSPORT_SECRET_KEY || 'passport_secret',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './db' }),
  }),
);
app.use(passport.authenticate('session'));

routing(app);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
