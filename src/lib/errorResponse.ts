import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Standard shape for an unexpected-error response: log the full error
 * server-side tagged with a short reference code, and return only a clean,
 * generic message plus that code to the client — never the error itself
 * (message, stack, table/column names, query text) ever reaches the user.
 *
 * The user can quote the ref code when reporting an issue, letting us grep
 * server logs for `[<ref>]` to find the exact incident instantly instead of
 * guessing from a timestamp.
 */
export function serverError(e: unknown, message = 'Sunucu hatası', status = 500) {
  const ref = crypto.randomBytes(4).toString('hex');
  console.error(`[${ref}]`, e);
  return NextResponse.json({ error: message, ref }, { status });
}
