import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin, UPLOADS_BUCKET } from '@/lib/supabase';
import { checkRateLimit, rateLimitMessage } from '@/lib/rateLimit';
import { serverError } from '@/lib/errorResponse';
import crypto from 'node:crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Extension and stored content-type come from the file's OWN bytes (below),
// never from the client-supplied filename or the client-asserted MIME
// label — `file.type` is just whatever Content-Type the uploader's request
// declared for that form-data part, which a request crafted outside a
// browser can set to anything regardless of the actual file content.
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Identify the real image format from its magic bytes. Returns null if the
 * content doesn't match any allowed format, regardless of what the
 * uploader's request claimed it was. */
function detectRealImageType(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.length >= 6 && buffer.subarray(0, 4).toString('ascii') === 'GIF8') return 'image/gif';
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
}

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

    // The client-declared type above is only a fast pre-check. The real
    // decision is the file's own magic bytes — a mismatch means the content
    // isn't actually what the request claimed.
    const realType = detectRealImageType(buffer);
    if (!realType) return NextResponse.json({ error: 'Dosya içeriği geçerli bir görsel değil' }, { status: 400 });

    const ext = EXT_BY_TYPE[realType];
    const hash = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${hash}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(UPLOADS_BUCKET)
      .upload(filename, buffer, { contentType: realType });

    if (error) {
      return serverError(error, 'Yükleme hatası');
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(UPLOADS_BUCKET).getPublicUrl(filename);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (e) {
    return serverError(e, 'Yükleme hatası');
  }
}
