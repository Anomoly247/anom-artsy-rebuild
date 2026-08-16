CREATE TABLE `user_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(150) NOT NULL,
	`message` text NOT NULL,
	`notification_type` enum('achievement','event','badge','system') NOT NULL DEFAULT 'system',
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_souvenir_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`badge_key` varchar(50) NOT NULL,
	`badge_title` varchar(100) NOT NULL,
	`realm_name` varchar(50) NOT NULL DEFAULT 'Moonberry Farm',
	`image_url` text,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_souvenir_badges_id` PRIMARY KEY(`id`)
);
