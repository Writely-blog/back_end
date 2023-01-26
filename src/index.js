import * as dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import xss from 'xss-clean';
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';
import checkAuth from './middleware/checkAuth.js';
import authRoutes from './routes/auth.routes.js';
import { authPostRouter, postRouter } from './routes/posts.routes.js';
dotenv.config();

const app = express();

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json()); // support json encoded bodies
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
app.use('/auth', authRoutes);
app.use('/posts', postRouter);
app.use('/posts', checkAuth, authPostRouter);

//error handlers
app.use(errorHandlerMiddleware);
app.use(notFound);

export default app;
