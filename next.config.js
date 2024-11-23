/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Instead of suppressHydrationWarning, we'll use experimental features
  experimental: {
    // This will help with hydration warnings
    strictNextHead: true,
  },
  // Add any other necessary configurations here
}

module.exports = nextConfig 