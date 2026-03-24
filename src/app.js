import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(
  express.json({
    limit: '10mb',
  })
);
app.use(cookieParser());
app.use(express.urlencoded());

// 3. Routes Import
import userRouter from './routes/user.routes.js';

// 4. Routes Declaration
// Professional standard: Version your API
app.use('/api/v1/users', userRouter);

// Final URL looks like: http://localhost:8000/api/v1/users/register

export default app;
