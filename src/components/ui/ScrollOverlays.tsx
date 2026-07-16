'use client';

import dynamic from 'next/dynamic';

const ScrollDownIndicator = dynamic(() => import('./ScrollDownIndicator'), { ssr: false });
const ScrollProgressBar = dynamic(() => import('./ScrollProgressBar'), { ssr: false });

export default function ScrollOverlays() {
  return (
    <>
      <ScrollDownIndicator />
      <ScrollProgressBar />
    </>
  );
}
