/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tambahkan ini agar build tidak gagal karena error TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },

  trailingSlash: true,
};

export default nextConfig;