import './globals.css';
import PressFx from '@/components/PressFx';

import { SITE_URL, keywords, site } from '@/data/site';

const description = 'Ubuntu & Jollof — Taste of Togetherness. Smoky jollof rice, African plates, grills, pizza, breakfast and fresh bakery at 4 Paris Avenue, Bordeaux, Randburg. Budget friendly, in Rands. Order on WhatsApp.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Ubuntu & Jollof | Jollof Rice & African Food in Randburg', template: '%s | Ubuntu & Jollof' },
  description,
  keywords,
  applicationName: 'Ubuntu & Jollof',
  authors: [{ name: 'Ubuntu & Jollof' }],
  creator: 'Empire Digitals',
  category: 'restaurant',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', locale: 'en_ZA', siteName: 'Ubuntu & Jollof', url: '/',
    title: 'Ubuntu & Jollof | Taste of Togetherness, Randburg',
    description,
    images: [{ url: '/og-logo.jpg', secureUrl: `${SITE_URL}/og-logo.jpg`, type: 'image/jpeg', width: 1200, height: 630, alt: 'Ubuntu & Jollof logo. Taste of Togetherness, Randburg.' }],
  },
  twitter: { card: 'summary_large_image', title: 'Ubuntu & Jollof | Taste of Togetherness', description, images: ['/og-logo.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-video-preview': -1, 'max-snippet': -1 } },
  formatDetection: { telephone: true, address: true },
  other: { 'geo.region': 'ZA-GP', 'geo.placename': 'Bordeaux, Randburg, Johannesburg', 'format-detection': 'telephone=yes' },
};

// Structured data (Google rich results). Opening hours are deliberately left out until confirmed.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Restaurant',
      '@id': `${SITE_URL}/#restaurant`,
      name: 'Ubuntu & Jollof',
      slogan: 'Taste of Togetherness',
      url: SITE_URL,
      image: [`${SITE_URL}/og-logo.jpg`, `${SITE_URL}/brand/logo.webp`],
      logo: `${SITE_URL}/brand/logo.webp`,
      telephone: site.phoneTel,
      priceRange: 'R',
      currenciesAccepted: 'ZAR',
      servesCuisine: ['African', 'Nigerian', 'Jollof rice', 'Pizza', 'Bakery', 'Chinese', 'Fast food', 'Breakfast'],
      hasMenu: `${SITE_URL}/menu`,
      acceptsReservations: false,
      address: { '@type': 'PostalAddress', streetAddress: '4 Paris Avenue, Bordeaux', addressLocality: 'Randburg', addressRegion: 'Gauteng', addressCountry: 'ZA' },
      areaServed: 'Randburg, Johannesburg',
      hasMap: site.mapLink,
      potentialAction: { '@type': 'OrderAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/order`, actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] }, deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'] },
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'Ubuntu & Jollof', inLanguage: 'en-ZA', publisher: { '@id': `${SITE_URL}/#restaurant` } },
  ],
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffc21a' };

export default function RootLayout({ children }) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <PressFx />
      </body>
    </html>
  );
}
