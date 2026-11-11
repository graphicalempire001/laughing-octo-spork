/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/webp'] },
  async headers() {
    // the private staff area must never be indexed or cached
    return [{ source: '/onions/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] }];
  },
};
export default nextConfig;
