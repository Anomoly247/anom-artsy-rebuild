CREATE TABLE IF NOT EXISTS `store_catalog_items` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  `category` enum('background','glow','decoration','digital','membership') NOT NULL,
  `image_url` text,
  `preview_class` varchar(120),
  `price_anom` decimal(10,2) NOT NULL DEFAULT '0',
  `price_real` decimal(10,2) NOT NULL DEFAULT '0',
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `guardian_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `source_record_id` varchar(160),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `store_catalog_items_id` PRIMARY KEY(`id`),
  CONSTRAINT `store_catalog_items_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `membership_plans` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price_anom` decimal(10,2) NOT NULL DEFAULT '0',
  `price_real` decimal(10,2) NOT NULL DEFAULT '0',
  `storage_limit` int NOT NULL DEFAULT 0,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `membership_plans_id` PRIMARY KEY(`id`),
  CONSTRAINT `membership_plans_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `user_entitlements` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `catalog_item_id` int NOT NULL,
  `grant_source` enum('coin','purchase','membership','admin') NOT NULL,
  `status` enum('active','revoked','expired') NOT NULL DEFAULT 'active',
  `granted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL,
  `source_ref` varchar(160),
  CONSTRAINT `user_entitlements_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_memberships` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `status` enum('active','cancelled','expired') NOT NULL DEFAULT 'active',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL,
  `source_ref` varchar(160),
  CONSTRAINT `user_memberships_id` PRIMARY KEY(`id`)
);
