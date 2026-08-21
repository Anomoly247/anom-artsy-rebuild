import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
const apply = process.argv.includes("--apply");
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const connection = await mysql.createConnection({
  uri: databaseUrl,
  ssl: { rejectUnauthorized: false },
  multipleStatements: false,
});

const requiredTables = ["store_coin_packs", "digital_checkout_sessions"];
const [rows] = await connection.query("SHOW TABLES");
const existing = new Set(Object.values(rows).flatMap((row) => Object.values(row)));
console.log("CHECKOUT_TABLES", requiredTables.map((name) => `${name}:${existing.has(name) ? "exists" : "missing"}`).join(", "));

if (!apply) {
  console.log("INVENTORY_ONLY: rerun with --apply to create missing checkout tables and seed draft Coin packs");
  await connection.end();
  process.exit(0);
}

await connection.query(`CREATE TABLE IF NOT EXISTS \`store_coin_packs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(120) NOT NULL UNIQUE,
  \`name\` VARCHAR(120) NOT NULL,
  \`description\` TEXT NULL,
  \`coin_amount\` INT NOT NULL,
  \`price_cents\` INT NOT NULL,
  \`currency\` VARCHAR(3) NOT NULL DEFAULT 'usd',
  \`status\` ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  \`guardian_status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  \`source_record_id\` VARCHAR(160) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`);

await connection.query(`CREATE TABLE IF NOT EXISTS \`digital_checkout_sessions\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`stripe_session_id\` VARCHAR(255) NOT NULL UNIQUE,
  \`request_key\` VARCHAR(160) NOT NULL UNIQUE,
  \`checkout_url\` TEXT NULL,
  \`payment_intent_id\` VARCHAR(255) NULL,
  \`purchase_type\` ENUM('coin_pack','catalog_item','membership') NOT NULL,
  \`reference_id\` INT NOT NULL,
  \`amount_cents\` INT NOT NULL,
  \`currency\` VARCHAR(3) NOT NULL,
  \`status\` ENUM('pending','paid','failed','expired') NOT NULL DEFAULT 'pending',
  \`metadata\` JSON NULL,
  \`fulfilled_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`);

const packs = [
  ["coin-starter-100", "Starter Anom Coin", "A small digital Coin pack for approved AO Store items.", 100, 500],
  ["coin-builder-500", "Builder Anom Coin", "A larger digital Coin pack for identity goods and memberships.", 500, 2000],
  ["coin-universe-1200", "Universe Anom Coin", "A premium digital Coin pack supporting the living AO world.", 1200, 4000],
];
for (const [slug, name, description, coinAmount, priceCents] of packs) {
  await connection.execute(
    `INSERT INTO \`store_coin_packs\` (slug, name, description, coin_amount, price_cents, currency, status, guardian_status, source_record_id)
     VALUES (?, ?, ?, ?, ?, 'usd', 'draft', 'pending', ?)
     ON DUPLICATE KEY UPDATE slug = VALUES(slug)`,
    [slug, name, description, coinAmount, priceCents, `seed:${slug}`],
  );
}

console.log("DIGITAL_CHECKOUT_COMPATIBILITY_APPLY_COMPLETE");
await connection.end();
