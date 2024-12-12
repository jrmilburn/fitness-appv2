import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public', // Directory where the service worker and related files will be generated
  register: true, // Automatically register the service worker
  skipWaiting: true, // Allow the new service worker to activate immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  buildExcludes: [
    /middleware-manifest.json$/, 
    /app-build-manifest.json$/, 
    /build-manifest.json$/
  ], // Exclude problematic files
})({
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
        hostname: "images.openfoodfacts.org",
        port: '',
        pathname: '/**'
      }
    ],
  },
  reactStrictMode: false, // Enable React strict mode
});

export default nextConfig;