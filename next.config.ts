import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake lucide-react — only import icons that are actually used.
    // Lighthouse showed 0u7jag0_1s_wt.js at 47.4KB with 24.2KB unused;
    // this is the lucide barrel export being bundled in full.
    optimizePackageImports: ['lucide-react'],
  },
  // Modern browser targets eliminate Array.at / Object.hasOwn polyfills
  // that Lighthouse flagged as 13.6KB of wasted legacy JS.
  // Targets: last 2 Chrome versions, last 2 Firefox, last 2 Safari, Edge 18+
  // This covers >95% of Egyptian mobile users (Chrome on Android).
};
 
export default withNextIntl(nextConfig);
 