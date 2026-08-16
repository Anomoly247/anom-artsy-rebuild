CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int,
  `details` json,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
