-- Same defense-in-depth posture as the earlier RLS migration: enabled, no
-- policies, so it's fully denied to anon/authenticated. Only the app's
-- privileged (BYPASSRLS) connection ever needs to touch this table.
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;
