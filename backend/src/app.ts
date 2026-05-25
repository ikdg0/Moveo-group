import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './env';
import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';
import usersRouter from './routes/users';
import { errorHandler, notFound } from './middleware/errors';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins.includes('*') ? true : env.corsOrigins,
      credentials: false,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

  const v1 = express.Router();
  v1.use('/auth', authRouter);
  v1.use('/bookings', bookingsRouter);
  v1.use('/users', usersRouter);
  app.use('/api/v1', v1);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
