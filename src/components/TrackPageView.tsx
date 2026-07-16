'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function TrackPageView() {
  const pathname = usePathname();
  const lastTracked = useRef('');

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;
    // Don't track the same page twice in a row
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
