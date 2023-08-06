/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    allowFutureImage: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: process.env.S3_HOSTNAME,
      },
    ],
  },
}

module.exports = nextConfig
