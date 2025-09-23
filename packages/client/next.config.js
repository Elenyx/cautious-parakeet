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
    // Allow external images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig