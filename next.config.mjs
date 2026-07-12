/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
};

export default nextConfig;
