import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");
const INVENTORY_ONLY = process.argv.includes("--inventory");
const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("DATABASE_URL is required. The value is never printed.");
}

const source = new URL(rawUrl);
const connection = await mysql.createConnection({
  host: source.hostname,
  port: Number(source.port || 4000),
  user: decodeURIComponent(source.username),
  password: decodeURIComponent(source.password),
  database: decodeURIComponent(source.pathname.replace(/^\//, "")),
  ssl: { rejectUnauthorized: true },
  multipleStatements: false,
});

const tableName = (row) => row.TABLE_NAME ?? row.table_name;
const columnName = (row) => row.COLUMN_NAME ?? row.column_name;
const indexName = (row) => row.INDEX_NAME ?? row.index_name;

async function query(sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows;
}

async function hasTable(name) {
  const rows = await query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
    [name],
  );
  return rows.length > 0;
}

async function getColumns(name) {
  const rows = await query(
    "SELECT column_name, column_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ordinal_position",
    [name],
  );
  return rows;
}

async function hasColumn(table, column) {
  const rows = await query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
    [table, column],
  );
  return rows.length > 0;
}

async function hasIndex(table, index) {
  const rows = await query(
    "SELECT index_name FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?",
    [table, index],
  );
  return rows.length > 0;
}

async function countRows(table) {
  const rows = await query(`SELECT COUNT(*) AS count FROM \`${table}\``);
  return Number(rows[0]?.count ?? rows[0]?.COUNT ?? 0);
}

async function change(description, statement, params = []) {
  if (!APPLY) {
    console.log(`DRY-RUN ${description}`);
    console.log(`  ${statement}`);
    return;
  }
  console.log(`APPLY ${description}`);
  await connection.query(statement, params);
}

async function ensureTable(name, ddl) {
  if (await hasTable(name)) {
    console.log(`EXISTS table ${name}`);
    return;
  }
  await change(`create table ${name}`, ddl);
}

async function ensureColumn(table, column, ddl) {
  if (!await hasTable(table)) {
    throw new Error(`Cannot add ${table}.${column}: table does not exist`);
  }
  if (await hasColumn(table, column)) {
    return;
  }
  await change(`add column ${table}.${column}`, `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${ddl}`);
}

async function ensureIndex(table, index, ddl) {
  if (!await hasTable(table)) {
    throw new Error(`Cannot add index ${index}: table ${table} does not exist`);
  }
  if (await hasIndex(table, index)) {
    return;
  }
  await change(`add index ${index} on ${table}`, `ALTER TABLE \`${table}\` ADD ${ddl}`);
}

const expectedUserColumns = [
  "openId",
  "name",
  "email",
  "loginMethod",
  "role",
  "status",
  "createdAt",
  "updatedAt",
  "lastSignedIn",
];

const expectedUserProfileColumns = [
  "user_id",
  "bio",
  "avatar_url",
  "neon_theme",
  "name_color",
  "decoration_package_ids",
  "level",
  "xp",
  "anom_coin_balance",
  "membership_tier",
  "tier_upgraded_at",
  "tier_expires_at",
  "coin_multiplier",
  "created_at",
  "updated_at",
];

async function inventory() {
  const tables = await query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name",
  );
  console.log("DATABASE_TABLES", tables.map(tableName));

  for (const target of ["users", "profiles", "user_profiles", "platform_settings"]) {
    if (!await hasTable(target)) {
      console.log(`MISSING_TABLE ${target}`);
      continue;
    }
    const columns = await getColumns(target);
    const names = columns.map(columnName);
    console.log(`COLUMNS ${target}`, columns.map((row) => ({
      name: columnName(row),
      type: row.COLUMN_TYPE ?? row.column_type,
      nullable: row.IS_NULLABLE ?? row.is_nullable,
      default: row.COLUMN_DEFAULT ?? row.column_default,
    })));
    if (target === "users") {
      console.log("MISSING_COLUMNS users", expectedUserColumns.filter((name) => !names.includes(name)));
    }
    if (target === "user_profiles") {
      console.log("MISSING_COLUMNS user_profiles", expectedUserProfileColumns.filter((name) => !names.includes(name)));
    }
  }

  try {
    const migrations = await query("SELECT id, hash, created_at FROM __drizzle_migrations ORDER BY created_at, id");
    console.log("LEGACY_MIGRATIONS", migrations);
  } catch (error) {
    console.log("LEGACY_MIGRATIONS_ERROR", error.code ?? error.message);
  }
}

const createUsers = `CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`openId\` VARCHAR(64) NULL UNIQUE,
  \`name\` TEXT NULL,
  \`email\` VARCHAR(320) NULL,
  \`loginMethod\` VARCHAR(64) NULL,
  \`role\` ENUM('user','admin') NOT NULL DEFAULT 'user',
  \`status\` ENUM('active','suspended') NOT NULL DEFAULT 'active',
  \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`lastSignedIn\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

const createUserProfiles = `CREATE TABLE IF NOT EXISTS \`user_profiles\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL UNIQUE,
  \`bio\` TEXT NULL,
  \`avatar_url\` TEXT NULL,
  \`neon_theme\` VARCHAR(50) DEFAULT 'magenta',
  \`name_color\` VARCHAR(7) DEFAULT '#00eaff',
  \`decoration_package_ids\` JSON NULL,
  \`level\` INT DEFAULT 1,
  \`xp\` INT DEFAULT 0,
  \`anom_coin_balance\` DECIMAL(10,2) DEFAULT 0,
  \`membership_tier\` ENUM('basic','vip','super_vip') DEFAULT 'basic',
  \`tier_upgraded_at\` TIMESTAMP NULL,
  \`tier_expires_at\` TIMESTAMP NULL,
  \`coin_multiplier\` DECIMAL(3,1) DEFAULT 1.0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createPlatformSettings = `CREATE TABLE IF NOT EXISTS \`platform_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`site_name\` VARCHAR(255) DEFAULT 'Anom Artsy',
  \`site_description\` TEXT NULL,
  \`logo_url\` TEXT NULL,
  \`favicon_url\` TEXT NULL,
  \`universe_url\` TEXT NULL,
  \`store_url\` TEXT NULL,
  \`social_links\` JSON NULL,
  \`custom_banner\` JSON NULL,
  \`partner_sites\` JSON NULL,
  \`primary_color\` VARCHAR(7) DEFAULT '#ff00cc',
  \`secondary_color\` VARCHAR(7) DEFAULT '#00eaff',
  \`accent_color\` VARCHAR(7) DEFAULT '#9d4edd',
  \`coin_reward_per_action\` INT DEFAULT 10,
  \`coin_reward_per_game\` INT DEFAULT 50,
  \`coin_reward_per_task\` INT DEFAULT 10,
  \`xp_per_level\` INT DEFAULT 100,
  \`enable_merch\` BOOLEAN DEFAULT TRUE,
  \`enable_lounges\` BOOLEAN DEFAULT TRUE,
  \`enable_games\` BOOLEAN DEFAULT TRUE,
  \`enable_collaboration\` BOOLEAN DEFAULT TRUE,
  \`enable_kids_corner\` BOOLEAN DEFAULT TRUE,
  \`stripe_public_key\` VARCHAR(255) NULL,
  \`stripe_secret_key\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createSocialGoodScores = `CREATE TABLE IF NOT EXISTS \`social_good_scores\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL UNIQUE,
  \`total_score\` INT NOT NULL DEFAULT 0,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createSocialGoodEvents = `CREATE TABLE IF NOT EXISTS \`social_good_events\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`event_key\` VARCHAR(160) NOT NULL UNIQUE,
  \`event_type\` VARCHAR(80) NOT NULL,
  \`points\` INT NOT NULL,
  \`source_route\` VARCHAR(120) NOT NULL,
  \`source_ref\` VARCHAR(160) NULL,
  \`status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

const createGuardianReviews = `CREATE TABLE IF NOT EXISTS \`guardian_reviews\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`source_record_id\` VARCHAR(160) NOT NULL UNIQUE,
  \`route\` VARCHAR(120) NULL,
  \`status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  \`reviewer_id\` INT NULL,
  \`reviewer_note\` TEXT NULL,
  \`reviewed_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

const createStoreCatalog = `CREATE TABLE IF NOT EXISTS \`store_catalog_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(120) NOT NULL UNIQUE,
  \`name\` VARCHAR(120) NOT NULL,
  \`description\` TEXT NULL,
  \`category\` ENUM('background','glow','decoration','digital','membership') NOT NULL,
  \`image_url\` TEXT NULL,
  \`preview_class\` VARCHAR(120) NULL,
  \`price_anom\` DECIMAL(10,2) NOT NULL DEFAULT 0,
  \`price_real\` DECIMAL(10,2) NOT NULL DEFAULT 0,
  \`status\` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  \`guardian_status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  \`source_record_id\` VARCHAR(160) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createMembershipPlans = `CREATE TABLE IF NOT EXISTS \`membership_plans\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(80) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`description\` TEXT NULL,
  \`price_anom\` DECIMAL(10,2) NOT NULL DEFAULT 0,
  \`price_real\` DECIMAL(10,2) NOT NULL DEFAULT 0,
  \`storage_limit\` INT NOT NULL DEFAULT 0,
  \`status\` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const createEntitlements = `CREATE TABLE IF NOT EXISTS \`user_entitlements\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`catalog_item_id\` INT NOT NULL,
  \`grant_source\` ENUM('coin','purchase','membership','admin') NOT NULL,
  \`status\` ENUM('active','revoked','expired') NOT NULL DEFAULT 'active',
  \`granted_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`expires_at\` TIMESTAMP NULL,
  \`source_ref\` VARCHAR(160) NULL,
  UNIQUE KEY \`user_entitlements_user_catalog_status_unique\` (\`user_id\`, \`catalog_item_id\`, \`status\`)
)`;

const createMemberships = `CREATE TABLE IF NOT EXISTS \`user_memberships\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`plan_id\` INT NOT NULL,
  \`status\` ENUM('active','cancelled','expired') NOT NULL DEFAULT 'active',
  \`started_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`expires_at\` TIMESTAMP NULL,
  \`source_ref\` VARCHAR(160) NULL
)`;

if (INVENTORY_ONLY || !APPLY) {
  await inventory();
}

if (APPLY) {
  await ensureTable("users", createUsers);
  await ensureTable("user_profiles", createUserProfiles);
  await ensureTable("platform_settings", createPlatformSettings);
  await ensureTable("social_good_scores", createSocialGoodScores);
  await ensureTable("social_good_events", createSocialGoodEvents);
  await ensureTable("guardian_reviews", createGuardianReviews);
  await ensureTable("store_catalog_items", createStoreCatalog);
  await ensureTable("membership_plans", createMembershipPlans);
  await ensureTable("user_entitlements", createEntitlements);
  await ensureTable("user_memberships", createMemberships);

  const userColumns = {
    openId: "VARCHAR(64) NULL",
    name: "TEXT NULL",
    email: "VARCHAR(320) NULL",
    loginMethod: "VARCHAR(64) NULL",
    role: "ENUM('user','admin') NOT NULL DEFAULT 'user'",
    status: "ENUM('active','suspended') NOT NULL DEFAULT 'active'",
    createdAt: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updatedAt: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    lastSignedIn: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
  };
  for (const [column, ddl] of Object.entries(userColumns)) {
    await ensureColumn("users", column, ddl);
  }

  const profileColumns = {
    user_id: "INT NULL",
    bio: "TEXT NULL",
    avatar_url: "TEXT NULL",
    neon_theme: "VARCHAR(50) DEFAULT 'magenta'",
    name_color: "VARCHAR(7) DEFAULT '#00eaff'",
    decoration_package_ids: "JSON NULL",
    level: "INT DEFAULT 1",
    xp: "INT DEFAULT 0",
    anom_coin_balance: "DECIMAL(10,2) DEFAULT 0",
    membership_tier: "ENUM('basic','vip','super_vip') DEFAULT 'basic'",
    tier_upgraded_at: "TIMESTAMP NULL",
    tier_expires_at: "TIMESTAMP NULL",
    coin_multiplier: "DECIMAL(3,1) DEFAULT 1.0",
    created_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  };
  for (const [column, ddl] of Object.entries(profileColumns)) {
    await ensureColumn("user_profiles", column, ddl);
  }

  await ensureIndex("user_profiles", "user_profiles_user_id_unique", "UNIQUE INDEX `user_profiles_user_id_unique` (`user_id`)");

  if (await hasTable("platform_settings")) {
    const settingsCount = await countRows("platform_settings");
    if (settingsCount === 0) {
      await change(
        "seed one neutral platform settings row",
        "INSERT INTO `platform_settings` (`site_name`, `site_description`, `primary_color`, `secondary_color`, `accent_color`) VALUES (?, ?, ?, ?, ?)",
        ["Anom Artsy", "Anom's Universe", "#ff00cc", "#00eaff", "#9d4edd"],
      );
    } else {
      console.log(`EXISTS platform_settings rows=${settingsCount}`);
    }
  }

  console.log("COMPATIBILITY_APPLY_COMPLETE");
} else {
  console.log("DRY_RUN_ONLY no changes were made; use --apply only after reviewing inventory output");
}

await connection.end();
