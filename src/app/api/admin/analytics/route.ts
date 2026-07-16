import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '30', 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // Total views in period
  const totalViews = await prisma.pageView.count({ where: { createdAt: { gte: since } } });

  // Total views last 7 days for comparison
  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);
  const views7d = await prisma.pageView.count({ where: { createdAt: { gte: since7 } } });

  // Daily views (last N days)
  const allRows = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, source: true, page: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date (YYYY-MM-DD)
  const dailyMap: Record<string, number> = {};
  const sourceMap: Record<string, number> = {};
  const pageMap: Record<string, number> = {};

  for (const row of allRows) {
    const dateKey = row.createdAt.toISOString().slice(0, 10);
    dailyMap[dateKey] = (dailyMap[dateKey] ?? 0) + 1;
    sourceMap[row.source] = (sourceMap[row.source] ?? 0) + 1;
    pageMap[row.page] = (pageMap[row.page] ?? 0) + 1;
  }

  // Fill in missing dates
  const daily: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    daily.push({ date: key, views: dailyMap[key] ?? 0 });
  }

  // Top pages (sorted by count)
  const topPages = Object.entries(pageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  // Sources
  const sources = [
    { source: 'direct', label: 'Doğrudan / Direct', color: '#D4AF37', count: sourceMap['direct'] ?? 0 },
    { source: 'google', label: 'Google Arama', color: '#4285f4', count: sourceMap['google'] ?? 0 },
    { source: 'meta', label: 'Meta (FB/Instagram)', color: '#1877f2', count: sourceMap['meta'] ?? 0 },
    { source: 'search', label: 'Diğer Arama', color: '#6c757d', count: sourceMap['search'] ?? 0 },
    { source: 'twitter', label: 'Twitter / X', color: '#1da1f2', count: sourceMap['twitter'] ?? 0 },
    { source: 'linkedin', label: 'LinkedIn', color: '#0077b5', count: sourceMap['linkedin'] ?? 0 },
    { source: 'tiktok', label: 'TikTok', color: '#ff0050', count: sourceMap['tiktok'] ?? 0 },
    { source: 'youtube', label: 'YouTube', color: '#ff0000', count: sourceMap['youtube'] ?? 0 },
    { source: 'whatsapp', label: 'WhatsApp', color: '#25d366', count: sourceMap['whatsapp'] ?? 0 },
    { source: 'other', label: 'Diğer', color: '#888', count: sourceMap['other'] ?? 0 },
  ].filter(s => s.count > 0);

  return NextResponse.json({ totalViews, views7d, daily, topPages, sources });
}
