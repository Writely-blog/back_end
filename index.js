import * as dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';
import checkAuth from './middleware/checkAuth.js';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json()); // support json encoded bodies
app.use(cors());

//routes
app.use('/auth', authRoutes);
app.use('/posts', checkAuth, postsRoutes);

//error handlers
app.use(errorHandlerMiddleware);
app.use(notFound);

const start = () => {
  try {
    app.listen(port, () => console.log(`Server is listening on ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
