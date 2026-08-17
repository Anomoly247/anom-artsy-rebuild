-- Prevent simultaneous duplicate active access records for the same user and catalog item.
-- Historical revoked and expired states remain representable through the status column.
ALTER TABLE `user_entitlements`
  ADD CONSTRAINT `user_entitlements_user_catalog_status_unique`
  UNIQUE (`user_id`, `catalog_item_id`, `status`);
