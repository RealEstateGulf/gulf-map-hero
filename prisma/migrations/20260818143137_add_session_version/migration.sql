-- Lets logout and password changes genuinely invalidate a JWT server-side.
-- The token embeds the version it was issued at; getSession() rejects any
-- token whose embedded version doesn't match the user's current value.
ALTER TABLE "User" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;
