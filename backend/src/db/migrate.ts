import { pool } from './pool';

const SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name      VARCHAR(80)  NOT NULL,
  email           VARCHAR(160) NOT NULL UNIQUE,
  phone           VARCHAR(40)  NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE booking_status   AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE booking_vehicle  AS ENUM ('premium', 'business', 'prestige', 'minibus');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status            booking_status   NOT NULL DEFAULT 'pending',
  vehicle_type     booking_vehicle  NOT NULL,
  origin_text       VARCHAR(255)     NOT NULL,
  destination_text  VARCHAR(255)     NOT NULL,
  scheduled_at      TIMESTAMPTZ      NOT NULL,
  passengers        INT              NOT NULL DEFAULT 1,
  estimated_price   NUMERIC(8,2)     NOT NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id, created_at DESC);
`;

async function main() {
  console.log('[migrate] applying schema…');
  await pool.query(SQL);
  console.log('[migrate] done.');
  await pool.end();
}

main().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
