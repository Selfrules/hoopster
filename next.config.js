/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This will suppress the hydration warnings
  suppressHydrationWarning: true 
}

module.exports = nextConfig 