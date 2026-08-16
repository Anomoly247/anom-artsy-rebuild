CREATE TABLE `challenge_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challenge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`progress_score` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`reward_claimed` boolean NOT NULL DEFAULT false,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `challenge_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasonal_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`season_name` varchar(50) NOT NULL DEFAULT 'Autumn 2026',
	`reward_coins` int NOT NULL DEFAULT 100,
	`is_active` boolean NOT NULL DEFAULT true,
	`end_date` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seasonal_challenges_id` PRIMARY KEY(`id`)
);
