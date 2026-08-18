import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin, UPLOADS_BUCKET } from '@/lib/supabase';
import { checkRateLimit, rateLimitMessage } from '@/lib/rateLimit';
import crypto from 'node:crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Extension is derived from the validated MIME type, never from the
// client-supplied filename, so it can't be used to smuggle path segments
// or an unexpected extension into the storage key.
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = await checkRateLimit('upload', session.userId);
  if (!limit.allowed) {
    return NextResponse.json({ error: rateLimitMessage(limit.retryAfterSeconds) }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Geçersiz dosya türü (JPEG, PNG, WebP, GIF)' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Dosya 10MB limitini aşıyor' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = EXT_BY_TYPE[file.type] ?? 'jpg';
    const hash = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${hash}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(UPLOADS_BUCKET)
      .upload(filename, buffer, { contentType: file.type });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(UPLOADS_BUCKET).getPublicUrl(filename);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 });
  }
}
