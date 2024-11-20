import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public', // Directory where the service worker and related files will be generated
  register: true, // Automatically register the service worker
  skipWaiting: true, // Allow the new service worker to activate immediately
})( {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
});

export default nextConfig;