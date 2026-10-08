import type { Metadata } from 'next';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import PropertyDetailClient from './PropertyDetailClient';

const getProperty = cache(async (slug: string) =>
  prisma.property.findFirst({ where: { OR: [{ slug }, { id: slug }] } }).catch(() => null)
);

const CATEGORY_TYPE: Record<string, string> = {
  APARTMENT: 'Apartment',
  VILLA: 'SingleFamilyResidence',
  BEACHFRONT: 'SingleFamilyResidence',
  COMMERCIAL: 'Place',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

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

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return <PropertyDetailClient params={params} />;
  }

  const photos = JSON.parse(property.photos || '[]') as string[];
  const canonical = `${SITE_URL}/properties/${property.slug}`;
  const priceNumber = Number(property.price);

  const listingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    url: canonical,
    name: property.titleAr,
    description: property.descriptionAr || property.titleAr,
    image: photos,
    datePosted: property.createdAt.toISOString(),
    about: {
      '@type': CATEGORY_TYPE[property.category] || 'Residence',
      name: property.titleAr,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.area,
        unitCode: 'MTK',
      },
      numberOfRooms: property.rooms,
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.cityEn,
        addressRegion: property.locationEn,
        addressCountry: 'TR',
      },
    },
    offers: {
      '@type': 'Offer',
      price: Number.isFinite(priceNumber) ? priceNumber : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'العقارات', item: `${SITE_URL}/properties` },
      { '@type': 'ListItem', position: 3, name: property.titleAr, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PropertyDetailClient params={params} />
    </>
  );
}
