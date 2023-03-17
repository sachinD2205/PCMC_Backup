/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["203.129.224.92", "15.206.219.76", "122.15.104.76"],
  },
  // devIndicators: {
  //   buildActivity: true,
  // },
};

module.exports = nextConfig;
