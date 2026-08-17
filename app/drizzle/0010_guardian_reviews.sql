CREATE TABLE `guardian_reviews` (
  `id` int AUTO_INCREMENT NOT NULL,
  `source_record_id` varchar(160) NOT NULL,
  `route` varchar(120),
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reviewer_id` int,
  `reviewer_note` text,
  `reviewed_at` timestamp,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `guardian_reviews_id` PRIMARY KEY(`id`),
  CONSTRAINT `guardian_reviews_source_record_id_unique` UNIQUE(`source_record_id`)
);
