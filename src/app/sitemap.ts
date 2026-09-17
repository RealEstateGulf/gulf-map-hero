import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://www.almiftahrealestate.com';

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/properties', changeFrequency: 'daily', priority: 0.9 },
  { path: '/citizenship', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/turkey', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/vip', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/insights', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    prisma.property.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.insightPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map(p => ({
    url: `${SITE_URL}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const insightEntries: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${SITE_URL}/insights/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...propertyEntries, ...insightEntries];
}
