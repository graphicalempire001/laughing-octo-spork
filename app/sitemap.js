import { SITE_URL, promos } from '@/data/site';
import { getMenu } from '@/lib/store';

export const dynamic = 'force-dynamic'; // dishes added in /onions appear in the image index straight away

const abs = (u) => (u && u.startsWith('http') ? u : `${SITE_URL}${u}`);
const heroImgs = ['pizza', 'breakfast', 'african', 'bakery', 'chinese', 'fast-food'].map((n) => abs(`/hero/${n}.webp`));

const clip = (name, title, description) => ({
  title, description,
  thumbnail_loc: abs(`/promo/${name}-poster.webp`),
  content_loc: abs(`/promo/${name}.mp4`),
});

// Sitemap = pages + an image index + a video index, so Google Images and Video can find everything.
export default async function sitemap() {
  const now = new Date();
  const items = (await getMenu().catch(() => [])).filter((i) => i.available !== false);
  const dishImages = [...new Set(items.map((i) => abs(i.img)).filter(Boolean))];
  const brand = abs('/brand/logo.webp');
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1, images: [brand, abs('/og-logo.jpg'), ...heroImgs],
      videos: [clip('chef', 'We’ve got the best chefs', 'The Ubuntu and Jollof chefs grilling chicken at 4 Paris Avenue, Bordeaux, Randburg.')] },
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: 'daily', priority: 0.9, images: [...dishImages, abs('/promo/budget-end.webp')],
      videos: [clip('budget', 'Budget friendly yet so satisfying', 'Grilled chicken and jollof rice at Ubuntu and Jollof, Randburg.')] },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, images: [abs('/promo/chef-end.webp'), abs('/menu/native-soup.webp')] },
    { url: `${SITE_URL}/kids`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, images: [abs('/promo/kids-end.webp')],
      videos: [clip('kids', 'Even the kids can’t hold back', 'Kids enjoying jollof rice and chicken at Ubuntu and Jollof.')] },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, images: [abs('/promo/delivery-end.webp')],
      videos: [clip('delivery', 'We’ve got you covered', 'Make your orders now. Ubuntu and Jollof delivery in Randburg.')] },
  ];
}
