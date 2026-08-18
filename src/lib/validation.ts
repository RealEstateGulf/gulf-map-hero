import { z } from 'zod';

// Shared input-validation schemas for admin write endpoints. Keeps API routes
// from trusting client-supplied JSON directly — malformed/oversized/wrong-type
// input is rejected with a 400 instead of reaching Prisma (which would either
// throw a raw 500 or, worse, silently coerce).

export const roleSchema = z.enum(['AGENT', 'ADMIN', 'SUPER_ADMIN']);

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().nullable();

export const userCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
  role: roleSchema.optional(),
  phone: optionalString(40),
  active: z.boolean().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  role: roleSchema.optional(),
  phone: optionalString(40),
  active: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
});

export const citySchema = z.object({
  nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().min(1).max(120),
  lat: z.coerce.number().finite().min(-90).max(90),
  lng: z.coerce.number().finite().min(-180).max(180),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const consultantSchema = z.object({
  nameAr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
  whatsapp: optionalString(40),
  email: z.union([z.string().trim().toLowerCase().email().max(200), z.literal(''), z.null()]).optional(),
  photoUrl: optionalString(2000),
  bioAr: optionalString(5000),
  bioEn: optionalString(5000),
  active: z.boolean().optional(),
});

// Slugs are used directly in public URLs (/insights/<slug>, /properties/<slug>),
// so restrict to the same URL-safe charset the admin UI already auto-generates
// from the title.
export const slugSchema = z.string().trim().min(1).max(160).regex(
  /^[a-z0-9]+(-[a-z0-9]+)*$/,
  'Slug yalnızca küçük harf, rakam ve tire içerebilir'
);

export const insightSchema = z.object({
  slug: slugSchema,
  titleAr: z.string().trim().min(1).max(300),
  titleEn: z.string().trim().min(1).max(300),
  excerptAr: z.string().max(1000).optional(),
  excerptEn: z.string().max(1000).optional(),
  contentAr: z.string().max(200_000).optional(),
  contentEn: z.string().max(200_000).optional(),
  coverImage: optionalString(2000),
  category: z.string().trim().max(60).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  readTime: z.coerce.number().int().min(0).max(999).optional(),
});

export const listingSchema = z.object({
  slug: slugSchema,
  city: z.string().trim().min(1).max(120),
  cityEn: z.string().trim().min(1).max(120),
  titleAr: z.string().trim().min(1).max(300),
  titleEn: z.string().trim().min(1).max(300),
  locationAr: z.string().trim().min(1).max(300),
  locationEn: z.string().trim().min(1).max(300),
  price: z.string().trim().min(1).max(60),
  area: z.coerce.number().int().min(0).max(10_000_000),
  rooms: z.string().trim().min(1).max(60),
  typeAr: z.string().trim().min(1).max(120),
  typeEn: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  badge: optionalString(60),
  descriptionAr: optionalString(20_000),
  descriptionEn: optionalString(20_000),
  featuresAr: z.string().max(20_000).optional(),
  featuresEn: z.string().max(20_000).optional(),
  photos: z.string().max(20_000).optional(),
  thumbGradient: z.string().max(120).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  agentId: optionalString(60),
  consultantId: optionalString(60),
});

export const contentRowsSchema = z.object({
  rows: z.array(z.object({
    key: z.string().trim().min(1).max(120),
    valueAr: z.string().max(50_000),
    valueEn: z.string().max(50_000),
  })).max(500),
});

const optionalUrl = (max: number) =>
  z.union([z.string().trim().max(max).url(), z.literal(''), z.null()]).optional();

export const seoSchema = z.object({
  titleAr: z.string().max(300).optional(),
  titleEn: z.string().max(300).optional(),
  descriptionAr: z.string().max(500).optional(),
  descriptionEn: z.string().max(500).optional(),
  keywords: optionalString(500),
  ogImageUrl: optionalUrl(2000),
  canonicalUrl: optionalUrl(2000),
});
