import express from 'express';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import corsMiddleware from './middlewares/cors.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import commentRouter from './routes/comment.js';
import { testConnection } from './utils/dbUtils.js';

dotenv.config();
testConnection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8000;
const publicPath = `${__dirname}/public`;
const { SESSION_KEY } = process.env;

app.use(session({
    secret: SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 2000*60*60
    }
}));
app.use((req, res, next) => {
    console.log('세션 데이터:', req.session);
    next();
});

// 보안 헤더 설정
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// CORS 설정
app.use(corsMiddleware);

app.use(express.static(publicPath));

// JSON 및 URL 인코딩 데이터 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 설정
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);


app.listen(port, () => {
    console.log(`Backend Server listening on port ${port}`);
});