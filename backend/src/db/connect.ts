import mongoose from 'mongoose';
import { env } from '../env';

export async function connectDB(): Promise<void> {
  await mongoose.connect(env.mongodbUri);
  console.log('[mongo] connected to', env.mongodbUri.replace(/\/\/.*@/, '//***@'));
}

mongoose.connection.on('error', (err) => {
  console.error('[mongo] connection error', err);
});
