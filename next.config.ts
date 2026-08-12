import type { NextConfig } from "next";

// Third-party origins the app actually loads at runtime: Mapbox (map tiles +
// web workers), Google tag manager/analytics, Meta Pixel, Google Fonts,
// Unsplash-hosted demo photos, and the project's own Supabase storage bucket.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.unsplash.com https://api.mapbox.com https://lfbdbgaoizztnzrpucmy.supabase.co https://www.googletagmanager.com https://www.facebook.com",
  "connect-src 'self' https://api.mapbox.com https://events.mapbox.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://connect.facebook.net https://lfbdbgaoizztnzrpucmy.supabase.co",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.81"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
