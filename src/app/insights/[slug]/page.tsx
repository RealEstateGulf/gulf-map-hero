import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { getArticle } from '@/data/articles';
import ArticleClient from './ArticleClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${SITE_URL}/insights/${slug}`;

  const staticArticle = getArticle(slug);
  if (staticArticle) {
    const title = `${staticArticle.titleAr} | مدونة المفتاح العقارية`;
    const description = staticArticle.excerpt;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title, description, url: canonical, siteName: SITE_NAME, locale: 'ar_AR', type: 'article',
        images: staticArticle.photo ? [{ url: staticArticle.photo }] : undefined,
      },
      twitter: { card: 'summary_large_image', title, description, images: staticArticle.photo ? [staticArticle.photo] : undefined },
    };
  }

  const post = await prisma.insightPost.findUnique({ where: { slug } }).catch(() => null);
  if (!post) return { title: 'المقال غير موجود | المفتاح العقارية' };

  const title = `${post.titleAr} | مدونة المفتاح العقارية`;
  const description = post.excerptAr || post.titleAr;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description, url: canonical, siteName: SITE_NAME, locale: 'ar_AR', type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return <ArticleClient params={params} />;
}
