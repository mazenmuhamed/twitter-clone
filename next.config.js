/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'scontent.fcai21-4.fna.fbcdn.net',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
    ],
  },
};

module.exports = nextConfig;
