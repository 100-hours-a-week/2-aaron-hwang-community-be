import express from 'express';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import userRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import commentRouter from './routes/comment.js';
import likeRouter from './routes/like.js';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 8000;
const publicPath = `${__dirname}/public`;
const { SESSION_KEY } = process.env;

app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(publicPath));
app.use(helmet.xssFilter());
app.use('/api/auth', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use(cors({
    origin: 'http://localhost:3000',
}));


app.listen(port, () => {
    console.log(`Backend Server listening on port ${port}`);
});