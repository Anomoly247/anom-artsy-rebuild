CREATE TABLE `social_good_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`event_key` varchar(160) NOT NULL,
	`event_type` varchar(80) NOT NULL,
	`points` int NOT NULL,
	`source_route` varchar(120) NOT NULL,
	`source_ref` varchar(160),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_good_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_good_events_event_key_unique` UNIQUE(`event_key`)
);
--> statement-breakpoint
CREATE TABLE `social_good_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_score` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_good_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_good_scores_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `universe_url` text;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `store_url` text;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `social_links` json;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `custom_banner` json;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD `partner_sites` json;