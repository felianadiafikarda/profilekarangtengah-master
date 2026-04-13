/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Tambahkan ini jika build gagal terus karena linting
  },

  trailingSlash: true,
  // 2. Wajib jika project kamu tidak berada di root domain (misal: /my-portfolio)
  // basePath: '/nama-repo-kamu', 

  images: {
    // 3. Wajib karena GitHub Pages tidak mendukung server-side image optimization
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

  // Menghindari error hydration saat deploy statis
  trailingSlash: true,
};

export default nextConfig;