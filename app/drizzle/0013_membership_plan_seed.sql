-- Membership tiers remain unpublished until pricing, privileges, and Guardian policy are reviewed.
INSERT INTO `membership_plans`
  (`slug`, `name`, `description`, `price_anom`, `price_real`, `storage_limit`, `status`)
VALUES
  ('guardian-apprentice', 'Guardian Apprentice', 'A first membership layer for identity styling, approved backgrounds, and the growing AO journey.', '0', '0', 1, 'draft'),
  ('world-builder', 'World Builder', 'Expanded room for curated identity pieces, collectible backgrounds, and world-connected customization.', '0', '0', 3, 'draft'),
  ('universe-guardian', 'Universe Guardian', 'A future access tier for deeper participation, approved collections, and Guardian-led community privileges.', '0', '0', 6, 'draft');
