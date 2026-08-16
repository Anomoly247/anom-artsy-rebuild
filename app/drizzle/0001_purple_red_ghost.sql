CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon_url` text,
	`category` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`action` varchar(100) NOT NULL,
	`entity_type` varchar(50) NOT NULL,
	`entity_id` int,
	`details` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message_id` int NOT NULL,
	`channel_id` int,
	`type` enum('mention','direct_message','channel_message','system') DEFAULT 'channel_message',
	`is_read` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`read_at` timestamp,
	CONSTRAINT `chat_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coin_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`type` enum('earn','spend') NOT NULL,
	`reason` varchar(100) NOT NULL,
	`related_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coin_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaboration_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('creator','member') NOT NULL DEFAULT 'member',
	`tasks_completed` int DEFAULT 0,
	`coins_earned` decimal(10,2) DEFAULT '0',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaboration_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creator_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`cause` varchar(50) NOT NULL,
	`image_url` text,
	`status` enum('active','completed','paused') NOT NULL DEFAULT 'active',
	`target_members` int DEFAULT 1,
	`current_members` int DEFAULT 1,
	`coin_reward_per_task` decimal(10,2) DEFAULT '10',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaboration_projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaboration_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`assigned_to` int,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`due_date` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaboration_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`update_type` enum('task_completed','member_joined','milestone_reached','comment') NOT NULL,
	`content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_updates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decoration_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`image_url` text,
	`cost_anom` decimal(10,2) DEFAULT '0',
	`cost_real` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `decoration_packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`post_type` enum('meme','highlight','update','achievement') NOT NULL,
	`title` varchar(100),
	`content` text,
	`image_url` text,
	`likes` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feed_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`game_name` varchar(50) NOT NULL,
	`score` int NOT NULL,
	`coin_reward` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kids_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`content_type` varchar(50) NOT NULL,
	`content_id` varchar(100) NOT NULL,
	`completed` boolean DEFAULT false,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kids_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','admin','member') DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('family','friends','coworkers') NOT NULL,
	`owner_id` int NOT NULL,
	`description` text,
	`neon_theme` varchar(50) DEFAULT 'magenta',
	`cost_anom` decimal(10,2) DEFAULT '0',
	`cost_real` decimal(10,2) DEFAULT '0',
	`is_public` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lounges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merch_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`request_id` int,
	`product_name` varchar(100) NOT NULL,
	`quantity` int DEFAULT 1,
	`total_price` decimal(10,2) NOT NULL,
	`payment_status` enum('pending','paid','failed') DEFAULT 'pending',
	`fulfillment_status` enum('pending','created','shipped','delivered') DEFAULT 'pending',
	`printful_order_id` varchar(100),
	`tracking_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merch_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merch_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`reference_images` json DEFAULT ('[]'),
	`status` enum('pending','approved','in_progress','completed','rejected') DEFAULT 'pending',
	`estimated_price` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merch_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `music_library` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`artist` varchar(100),
	`url` text NOT NULL,
	`duration` int,
	`is_playlist` boolean DEFAULT false,
	`playlist_items` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `music_library_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_name` varchar(255) DEFAULT 'Anom Artsy',
	`site_description` text,
	`logo_url` text,
	`favicon_url` text,
	`primary_color` varchar(7) DEFAULT '#ff00cc',
	`secondary_color` varchar(7) DEFAULT '#00eaff',
	`accent_color` varchar(7) DEFAULT '#9d4edd',
	`coin_reward_per_action` int DEFAULT 10,
	`coin_reward_per_game` int DEFAULT 50,
	`coin_reward_per_task` int DEFAULT 10,
	`xp_per_level` int DEFAULT 100,
	`enable_merch` boolean DEFAULT true,
	`enable_lounges` boolean DEFAULT true,
	`enable_games` boolean DEFAULT true,
	`enable_collaboration` boolean DEFAULT true,
	`enable_kids_corner` boolean DEFAULT true,
	`stripe_public_key` varchar(255),
	`stripe_secret_key` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tier_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`tier` enum('basic','vip','super_vip') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`duration` int DEFAULT 30,
	`stripe_payment_intent_id` varchar(100),
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`expires_at` timestamp,
	`completed_at` timestamp,
	`refunded_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tier_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`tip_type` enum('one_time','recurring') DEFAULT 'one_time',
	`message` text,
	`stripe_payment_intent_id` varchar(100),
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`completed_at` timestamp,
	`refunded_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`achievement_id` int NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_presence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`status` enum('online','away','offline') DEFAULT 'offline',
	`last_seen_at` timestamp NOT NULL DEFAULT (now()),
	`current_channel_id` int,
	CONSTRAINT `user_presence_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_presence_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`bio` text,
	`avatar_url` text,
	`neon_theme` varchar(50) DEFAULT 'magenta',
	`name_color` varchar(7) DEFAULT '#00eaff',
	`decoration_package_ids` json DEFAULT ('[]'),
	`level` int DEFAULT 1,
	`xp` int DEFAULT 0,
	`anom_coin_balance` decimal(10,2) DEFAULT '0',
	`membership_tier` enum('basic','vip','super_vip') DEFAULT 'basic',
	`tier_upgraded_at` timestamp,
	`tier_expires_at` timestamp,
	`coin_multiplier` decimal(3,1) DEFAULT '1.0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_vip_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`tier_id` int NOT NULL,
	`stripe_subscription_id` varchar(100),
	`status` enum('active','paused','cancelled') DEFAULT 'active',
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`renewal_date` timestamp,
	`cancelled_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_vip_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_vip_subscriptions_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `vip_benefits_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`benefit_type` varchar(50) NOT NULL,
	`amount` decimal(10,2),
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_benefits_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`monthly_price` decimal(10,2) NOT NULL,
	`coin_multiplier` decimal(3,1) DEFAULT '1.5',
	`xp_multiplier` decimal(3,1) DEFAULT '1.5',
	`benefits` json DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_tiers_id` PRIMARY KEY(`id`)
);
