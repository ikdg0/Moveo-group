import { createApp } from './app';
import { connectDB } from './db/connect';
import { env } from './env';

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[moveo-api] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  console.error('[startup] fatal', err);
  process.exit(1);
});
