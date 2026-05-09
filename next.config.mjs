/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.quran.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
