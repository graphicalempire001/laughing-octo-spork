export default function manifest() {
  return {
    name: 'Ubuntu & Jollof', short_name: 'Ubuntu & Jollof', description: 'Taste of Togetherness. Jollof, grills, pizza and bakery in Randburg.',
    start_url: '/', display: 'standalone', background_color: '#fff4cf', theme_color: '#ffc21a', lang: 'en-ZA',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }, { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  };
}
