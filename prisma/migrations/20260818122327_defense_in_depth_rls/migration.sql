-- Defense-in-depth Row Level Security.
--
-- The app itself does NOT rely on these policies: Prisma connects as the
-- `postgres` role, which has BYPASSRLS, so every query the app makes
-- ignores RLS entirely. All real authorization happens in the Next.js API
-- routes (session checks, role checks) — that is unchanged by this
-- migration.
--
-- This exists purely as a safety net: if anyone ever adds a client-side
-- Supabase call using the anon/authenticated key (a common way apps drift
-- into a vulnerability over time), these policies make sure that path can
-- only ever see the same "public" subset the app's own public API routes
-- already expose — never draft/unpublished content, and never User,
-- Consultant, or PageView rows at all.
--
-- Default posture: RLS enabled, no policy = fully denied. Access is opened
-- one SELECT policy at a time, only where the app already has an
-- equivalent public, read-only endpoint. No INSERT/UPDATE/DELETE policies
-- are added anywhere — all writes continue to require the privileged
-- server-side connection.

-- Property: public read matches GET /api/properties (published = true)
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_published" ON "Property"
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- City: public read matches GET /api/cities (active = true)
ALTER TABLE "City" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_active" ON "City"
  FOR SELECT TO anon, authenticated
  USING (active = true);

-- InsightPost: public read matches GET /api/insights (published = true)
ALTER TABLE "InsightPost" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_published" ON "InsightPost"
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- PageContent: site copy, all rows already served as-is by
-- GET /api/content/[pageKey] with no filtering — nothing sensitive here.
ALTER TABLE "PageContent" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_all" ON "PageContent"
  FOR SELECT TO anon, authenticated
  USING (true);

-- SeoSettings: public meta tags, same reasoning as PageContent.
ALTER TABLE "SeoSettings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_all" ON "SeoSettings"
  FOR SELECT TO anon, authenticated
  USING (true);

-- Consultant: no public endpoint exposes this today. RLS enabled, no
-- policy — fully denied to anon/authenticated.
ALTER TABLE "Consultant" ENABLE ROW LEVEL SECURITY;

-- PageView: internal analytics, never meant to be publicly readable.
ALTER TABLE "PageView" ENABLE ROW LEVEL SECURITY;

-- User: contains password hashes — must never be reachable outside the
-- privileged server connection.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
