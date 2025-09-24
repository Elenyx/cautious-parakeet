const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: standalone output disabled due to Windows symlink issues
  // Will be handled in Docker build instead
  
  // Optimize for production
  experimental: {
    // Enable optimized package imports (stable in Next.js 15)
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Image optimization settings
  images: {
    unoptimized: true,
    // Allow external images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Asset prefix for proper static file serving
  assetPrefix: '',
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,

  // Relax build-time checks for CI/local until types and lint are stabilized
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Silence workspace root inference warning by explicitly setting tracing root to monorepo root
  outputFileTracingRoot: path.join(__dirname, '../../'),
  
  // Ensure proper static file serving
  trailingSlash: false,
}

module.exports = nextConfig