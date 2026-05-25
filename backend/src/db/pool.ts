import { Pool } from 'pg';
import { env } from '../env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  console.error('[pg] unexpected error on idle client', err);
});
