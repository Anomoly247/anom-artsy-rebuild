# AO Compatibility Migration

## Purpose

This compatibility runner repairs an existing AO database whose `__drizzle_migrations` ledger belongs to an older schema lineage. It preserves the legacy ledger and all existing rows while creating only missing current foundation tables and adding only missing authentication/profile columns.

The runner is intentionally separate from the normal Drizzle migration chain. It must not be added to `__drizzle_migrations`, and it must not be used as a replacement for reviewed migrations on a fresh database.

## Evidence from the production read-only audit

The production database is reachable over TLS and contains existing AO data. The observed table inventory included `users`, `coin_transactions`, profiles-related legacy tables, and numerous community tables, but did not include `platform_settings` or `user_profiles`. The legacy migration ledger contained IDs `1` through `10` and later IDs `2000001`, `2416717`, and `2416718`, which do not match the current repository’s committed migration sequence `0000` through `0014`.

The normal migration chain stopped on `ALTER TABLE platform_settings` because the ledger indicated earlier work had occurred while the base table was absent. This is a migration-history mismatch, not evidence that existing data should be reset.

## Files

- `app/scripts/ao-compatibility-migrate.mjs`: idempotent runner.
- `app/drizzle/schema.ts`: current application schema source.
- `app/drizzle/`: reviewed migrations for fresh or correctly aligned databases.

## Modes

The runner requires `DATABASE_URL` and uses a TLS profile with certificate verification. It never prints the connection string.

Inventory only:

```bash
railway run node scripts/ao-compatibility-migrate.mjs --inventory
```

Dry run (default):

```bash
railway run node scripts/ao-compatibility-migrate.mjs
```

Apply missing compatibility objects after reviewing the dry-run output:

```bash
railway run node scripts/ao-compatibility-migrate.mjs --apply
```

The apply mode creates only missing tables, adds only missing columns, adds the named profile uniqueness index if absent, and inserts one neutral `platform_settings` row only when that table is empty. It never drops, truncates, deletes, edits, or resets existing rows. It never writes to `__drizzle_migrations`.

## Required gates

Run `--inventory` first and save the output without credentials. Review the reported `users`, `profiles`, `user_profiles`, and `platform_settings` columns. Run the default dry run and review every proposed change. Take or confirm a TiDB backup before applying. Apply only after explicit production migration approval. If TiDB returns a permission error, stop and obtain a schema-write credential or use the provider SQL console; do not weaken TLS or retry destructively.

After apply, rerun `--inventory`, verify the required tables and columns, restart or redeploy the service if needed, and test the protected admin route with the private key only in the browser. The admin key must never appear in logs, screenshots, commits, or this document.

## Important limitations

The runner deliberately does not infer or rewrite the legacy `profiles` table because the current application schema defines `user_profiles` and the legacy profile table may have different ownership and provenance semantics. It reports legacy `profiles` columns for review rather than silently merging them. It also does not retrofit foreign keys onto legacy data, because existing orphaned rows must be reviewed before constraints are introduced.
