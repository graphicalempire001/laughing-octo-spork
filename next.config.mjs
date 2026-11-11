/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/webp'] },
  // Always put <title>/Open Graph tags in the <head> of the first HTML, for every crawler (WhatsApp, Telegram, iMessage, Discord...),
  // instead of streaming them later where some link-preview bots never look.
  htmlLimitedBots: /.*/,
  async headers() {
    // the private staff area must never be indexed or cached
    return [{ source: '/onions/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }] }];
  },
};
export default nextConfig;
