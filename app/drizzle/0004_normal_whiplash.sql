CREATE TABLE `lounge_message_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message_id` int NOT NULL,
	`user_id` int NOT NULL,
	`emoji` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_message_reactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_read_states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`last_read_message_id` int DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lounge_read_states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_soundscapes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`soundscape_type` varchar(50) DEFAULT 'cyber_rain',
	`volume` decimal(3,2) DEFAULT '0.50',
	`enabled` boolean DEFAULT true,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lounge_soundscapes_id` PRIMARY KEY(`id`),
	CONSTRAINT `lounge_soundscapes_lounge_id_unique` UNIQUE(`lounge_id`)
);
