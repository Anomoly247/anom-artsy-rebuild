-- Seed records are intentionally Guardian-pending until the owner reviews provenance and media.
INSERT INTO `store_catalog_items`
  (`slug`, `name`, `description`, `category`, `image_url`, `preview_class`, `price_anom`, `price_real`, `status`, `guardian_status`, `source_record_id`)
VALUES
  ('moonberry-background', 'Moonberry Farm', 'A cozy story-world background from Anom’s Corner.', 'background', '/media/anoms-corner/moonberry-1920x1080.webp', 'bg-ao-midnight', '40', '0', 'published', 'pending', 'ao-media-moonberry-farm-wide-001'),
  ('cyan-thread-glow', 'Cyan Thread Glow', 'A calm cyan halo for a connected identity.', 'glow', NULL, 'shadow-ao-cyan', '25', '0', 'published', 'pending', 'ao-cosmetic-cyan-thread-001'),
  ('gold-orbit-glow', 'Gold Orbit Glow', 'A warm mission accent for profiles and approved spaces.', 'glow', NULL, 'shadow-ao-gold', '30', '0', 'published', 'pending', 'ao-cosmetic-gold-orbit-001');
