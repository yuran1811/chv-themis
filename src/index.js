import cookieParser from 'cookie-parser';
// import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import methodOverride from 'method-override';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import route from './routes/index.js';

config();

const app = express();
const PORT = process.env.PORT || 1811;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'public')));
app.use(express.static(join(__dirname, '..', 'node_modules')));
app.use(urlencoded({ extended: true }));
app.use(json());

// app.use(cors());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));

route(app);

app.listen(PORT, () => {
	console.log(`Listening: http://localhost:${PORT}`);
});
