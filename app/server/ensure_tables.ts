import { getDb } from './db';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  console.log('Creating missing tables...');

  await db.execute(sql`CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    neon_theme VARCHAR(50) DEFAULT 'magenta',
    name_color VARCHAR(7) DEFAULT '#00eaff',
    decoration_package_ids JSON,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    anom_coin_balance DECIMAL(10, 2) DEFAULT '0',
    membership_tier ENUM('basic', 'vip', 'super_vip') DEFAULT 'basic',
    tier_upgraded_at TIMESTAMP NULL,
    tier_expires_at TIMESTAMP NULL,
    coin_multiplier DECIMAL(3, 1) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS decoration_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    cost_anom DECIMAL(10, 2) DEFAULT '0',
    cost_real DECIMAL(10, 2) DEFAULT '0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS coin_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('earn', 'spend') NOT NULL,
    reason VARCHAR(100) NOT NULL,
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS lounges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('family', 'friends', 'coworkers') NOT NULL,
    owner_id INT NOT NULL,
    description TEXT,
    neon_theme VARCHAR(50) DEFAULT 'magenta',
    cost_anom DECIMAL(10, 2) DEFAULT '0',
    cost_real DECIMAL(10, 2) DEFAULT '0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS lounge_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lounge_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS lounge_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lounge_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS kids_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`);

  await db.execute(sql`CREATE TABLE IF NOT EXISTS platform_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(100) DEFAULT 'Anom Artsy',
    site_description TEXT,
    primary_color VARCHAR(50) DEFAULT 'magenta',
    secondary_color VARCHAR(50) DEFAULT 'cyan',
    accent_color VARCHAR(50) DEFAULT 'purple',
    coin_reward_per_action INT DEFAULT 10,
    coin_reward_per_game INT DEFAULT 50,
    coin_reward_per_task INT DEFAULT 100,
    xp_per_level INT DEFAULT 500,
    enable_merch BOOLEAN DEFAULT true,
    enable_collaboration BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`);

  console.log('All missing tables ensured successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
