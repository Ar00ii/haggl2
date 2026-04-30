-- Mark rows produced by the demo data seeder so they can be cleanly
-- removed later without touching real user activity. Aggregates
-- (leaderboards, "X total sales", top sellers) intentionally count
-- these rows so a freshly-deployed instance feels populated; only the
-- seed/cleanup scripts consult the flag.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isSeed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "market_listings" ADD COLUMN IF NOT EXISTS "isSeed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "market_purchases" ADD COLUMN IF NOT EXISTS "isSeed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "market_reviews" ADD COLUMN IF NOT EXISTS "isSeed" BOOLEAN NOT NULL DEFAULT false;
