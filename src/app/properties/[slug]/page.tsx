import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import PropertyDetailClient from './PropertyDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findFirst({ where: { OR: [{ slug }, { id: slug }] } }).catch(() => null);

  if (!property) {
    return { title: 'العقار غير موجود | المفتاح العقارية' };
  }

  const title = `${property.titleAr} | ${property.locationAr} - المفتاح العقارية`;
  const description = (property.descriptionAr && property.descriptionAr.trim())
    || `${property.titleAr} للبيع في ${property.locationAr} — ${property.typeAr}, ${property.area} م² بسعر ${property.price}$. تواصل مع المفتاح العقارية للمزيد من التفاصيل والمعاينة.`;
  const canonical = `${SITE_URL}/properties/${property.slug}`;
  const photos = JSON.parse(property.photos || '[]') as string[];

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'ar_AR',
      type: 'website',
      images: photos[0] ? [{ url: photos[0] }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: photos[0] ? [photos[0]] : undefined,
    },
  };
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PropertyDetailClient params={params} />;
}
