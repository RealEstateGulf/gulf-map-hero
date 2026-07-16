import { createClient } from '@supabase/supabase-js';

export const UPLOADS_BUCKET = 'uploads';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);
