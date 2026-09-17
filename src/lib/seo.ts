import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const SITE_URL = 'https://www.almiftahrealestate.com';
export const SITE_NAME = 'Al Miftah Real Estate';

interface SeoFallback {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
}

/** Reads the admin-editable SeoSettings row for a page (by its content-editor
 * pageKey), falling back to hardcoded Arabic-first defaults when nothing has
 * been set — so every public page gets real metadata even before an admin
 * touches the SEO panel. */
export async function getSeoMetadata(pageKey: string, fallback: SeoFallback): Promise<Metadata> {
  const seo = await prisma.seoSettings.findUnique({ where: { pageKey } }).catch(() => null);

  const title = seo?.titleAr?.trim() || fallback.title;
  const description = seo?.descriptionAr?.trim() || fallback.description;
  const canonical = seo?.canonicalUrl?.trim() || `${SITE_URL}${fallback.path}`;
  const ogImage = seo?.ogImageUrl?.trim() || fallback.image;
  const keywords = seo?.keywords?.trim() || fallback.keywords;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'ar_AR',
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
