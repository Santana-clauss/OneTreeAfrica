/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export (for hosting on platforms like cPanel)
  trailingSlash: true, // Ensures URLs like /about/ work correctly

  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Required when using static export without a Node.js server
  },

  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
}

module.exports = nextConfig
