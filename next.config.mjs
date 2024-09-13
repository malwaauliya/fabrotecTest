/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com', // Replace this with your external image domain
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
