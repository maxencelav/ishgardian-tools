/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'beta.xivapi.com',
            port: '',
            pathname: '/api/1/asset/**',
          },
        ],
      },
};

export default nextConfig;
