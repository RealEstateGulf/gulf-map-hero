-- Add slug column, nullable at first so existing rows can be backfilled
ALTER TABLE "Property" ADD COLUMN "slug" TEXT;

-- Backfill: lowercase "cityEn-titleEn", collapse non-alphanumeric runs to a
-- single dash, trim leading/trailing dashes
UPDATE "Property"
SET "slug" = trim(both '-' from regexp_replace(lower("cityEn" || '-' || "titleEn"), '[^a-z0-9]+', '-', 'g'));

-- De-duplicate any collisions by appending a short suffix of the row id
WITH dupes AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY "createdAt") AS rn
  FROM "Property"
)
UPDATE "Property" p
SET "slug" = p."slug" || '-' || substr(p.id, 1, 6)
FROM dupes d
WHERE p.id = d.id AND d.rn > 1;

-- Every row now has a value — enforce NOT NULL + uniqueness going forward
ALTER TABLE "Property" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
