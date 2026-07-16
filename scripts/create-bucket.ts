import 'dotenv/config';
import { supabaseAdmin, UPLOADS_BUCKET } from '../src/lib/supabase';

async function main() {
  const { data: existing } = await supabaseAdmin.storage.getBucket(UPLOADS_BUCKET);
  if (existing) {
    console.log(`Bucket "${UPLOADS_BUCKET}" zaten mevcut.`);
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(UPLOADS_BUCKET, {
    public: true,
    fileSizeLimit: '10MB',
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  });

  if (error) {
    console.error('Bucket oluşturulamadı:', error.message);
    process.exit(1);
  }
  console.log(`Bucket "${UPLOADS_BUCKET}" oluşturuldu.`);
}

main();
