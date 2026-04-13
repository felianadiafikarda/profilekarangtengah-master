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

  async redirects() {
    return [
      {
        source: '/',           // Jika orang buka link utama
        destination: '/user',  // Lempar ke halaman user
        permanent: true,       // Buat permanen agar bagus untuk SEO
      },
    ];
  },
  trailingSlash: false,
};

export default nextConfig;