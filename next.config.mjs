import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  // Where the generated service worker and other PWA assets go
  dest: 'public',

  // Automatically register the service worker
  register: true,

  // Let the new service worker take control immediately
  skipWaiting: true,

  // Disable in development, enable in production
  disable: process.env.NODE_ENV !== 'production',

  // Exclude certain Next.js manifest files that can cause build issues
  buildExcludes: [
    /middleware-manifest.json$/,
    /app-build-manifest.json$/,
    /build-manifest.json$/,
  ],

  // Customize Workbox runtime caching rules
  runtimeCaching: [
    {
      // Cache static resources (images, CSS, JS) using Stale-While-Revalidate
      urlPattern: ({ request }) =>
        request.destination === 'image' ||
        request.destination === 'style' ||
        request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Do NOT cache dynamic API calls; always fetch from network
      // Update this regex to match your own domain or endpoints
      urlPattern: /^https:\/\/fitness\.joemilburn\.xyz\/api\/.*$/,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'api-calls',
      },
    },
  ],
})({
  // Next.js config below
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
});

export default nextConfig;
