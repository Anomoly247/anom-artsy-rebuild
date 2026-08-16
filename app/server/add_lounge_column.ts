import { getDb } from './db';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  try {
    await db.execute(sql`ALTER TABLE lounges ADD COLUMN is_public BOOLEAN DEFAULT true`);
    console.log('Added is_public column to lounges table successfully.');
  } catch (e: any) {
    console.log('Column may already exist or error:', e.message);
  }

  process.exit(0);
}

main();
