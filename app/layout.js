import './globals.css';
import PressFx from '@/components/PressFx';

export const metadata = {
  title: 'Ubuntu & Jollof — Randburg',
  description: 'Smoky firewood jollof, grills, pizza, breakfast and bakery at 4 Paris Avenue, Bordeaux, Randburg.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffc21a' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <PressFx />
      </body>
    </html>
  );
}
