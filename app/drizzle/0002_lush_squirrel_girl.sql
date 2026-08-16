ALTER TABLE `audit_log` MODIFY COLUMN `details` json;--> statement-breakpoint
ALTER TABLE `merch_requests` MODIFY COLUMN `reference_images` json;--> statement-breakpoint
ALTER TABLE `music_library` MODIFY COLUMN `playlist_items` json;--> statement-breakpoint
ALTER TABLE `user_profiles` MODIFY COLUMN `decoration_package_ids` json;--> statement-breakpoint
ALTER TABLE `vip_tiers` MODIFY COLUMN `benefits` json;