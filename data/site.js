const q = encodeURIComponent('4 Paris Avenue, Bordeaux, Randburg, South Africa');

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ubuntujollof.com').replace(/\/$/, '');

export const keywords = [
  'Ubuntu & Jollof', 'jollof rice Randburg', 'African restaurant Randburg', 'Nigerian food Randburg', 'Nigerian restaurant Bordeaux',
  'African food Bordeaux Randburg', 'jollof rice delivery Johannesburg', 'native soup and eba Randburg', 'fried yam and egg sauce',
  'budget friendly meals Randburg', 'pizza Randburg', 'breakfast Randburg', 'bakery Randburg', 'noodles Randburg', 'fast food Randburg',
  'kids friendly restaurant Randburg', 'order food online Randburg', 'WhatsApp food order Randburg', 'takeaway Randburg', 'Taste of Togetherness',
];

export const site = {
  name: 'Ubuntu & Jollof',
  tagline: 'Taste of Togetherness',
  phoneDisplay: '+27 71 064 0654',
  phoneTel: '+27710640654',
  wa: 'https://wa.me/27710640654',
  addressLines: ['4 Paris Avenue', 'Bordeaux, Randburg', 'South Africa'],
  mapLink: `https://www.google.com/maps/search/?api=1&query=${q}`,
  mapEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
  hours: 'Open daily · 10am – 10pm',
};
export const waLink = (text) => `${site.wa}?text=${encodeURIComponent(text)}`;

export const nav = [
  ['/', 'Home'],
  ['/menu', 'Menu'],
  ['/about', 'About'],
  ['/kids', 'Kids’ Zone'],
  ['/contact', 'Contact'],
];

// Promotional flyers, each matched to the section it belongs to.
export const promos = {
  chef:     { src: '/promo/chef',     w: 960, h: 540, max: '1760px', alt: 'We’ve got the best chefs. A smiling Ubuntu & Jollof chef grilling chicken. 4 Paris Avenue, Bordeaux, Randburg.' },
  delivery: { src: '/promo/delivery', w: 960, h: 540, max: '1760px', alt: 'We’ve got you covered. Make your orders now. Ubuntu & Jollof delivery rider giving a thumbs up.' },
  budget:   { src: '/promo/budget',   w: 840, h: 560, max: '1040px', alt: 'Budget friendly yet so satisfying. A customer enjoying grilled chicken and jollof rice.' },
  kids:     { src: '/promo/kids',     w: 840, h: 560, max: '1040px', alt: 'Even the kids can’t hold back. Two children excited to eat jollof rice and chicken.' },
};

// Hero slides: each image is matched to its category by file name in /public/hero.
export const slides = [
  { id: 'pizza',     img: '/hero/pizza.webp',     kicker: 'Hot from the oven', title: 'Pizzeria',  text: 'Hand-stretched, oven-hot and loaded to the edges.',      cta: 'Grab a slice',   cat: 'Pizzeria',  z: [1, 1.13],    pan: ['-1.5%', '-1%'] },
  { id: 'breakfast', img: '/hero/breakfast.webp', kicker: 'Start right',       title: 'Breakfast', text: 'A proper morning plate to start the day right.',          cta: 'Start your day', cat: 'Breakfast', z: [1.13, 1.02], pan: ['1.2%', '-0.8%'] },
  { id: 'african',   img: '/hero/african.webp',   kicker: 'Like home',         title: 'African',   text: 'Rich soups, tender meats and swallow served like home.',  cta: 'Taste it',       cat: 'African',   z: [1, 1.13],    pan: ['-1.5%', '1%'] },
  { id: 'bakery',    img: '/hero/bakery.webp',    kicker: 'Fresh daily',       title: 'Bakery',    text: 'Fresh loaves and pastries, warm from the oven.',          cta: 'Get a treat',    cat: 'Bakery',    z: [1.13, 1.02], pan: ['1.2%', '0.8%'] },
  { id: 'chinese',   img: '/hero/chinese.webp',   kicker: 'Wok fired',         title: 'Chinese',   text: 'Noodles and stir-fries with real wok heat.',              cta: 'Try it',         cat: 'Chinese',   z: [1, 1.13],    pan: ['-1%', '-1.5%'] },
  { id: 'fast-food', img: '/hero/fast-food.webp', kicker: 'Quick bites',       title: 'Fast Food', text: 'Burgers and crispy chicken, big flavour in no time.',     cta: 'Order now',      cat: 'Fast Food', z: [1.13, 1.02], pan: ['1%', '-1.2%'] },
];

export const categoryCovers = slides.map((s) => ({ cat: s.cat, img: s.img, blurb: s.text }));

export const steps = [
  { n: 1, ico: '👆', title: 'Pick your dishes', text: 'Browse the menu and tap “+ Add” on everything you fancy.' },
  { n: 2, ico: '🛍️', title: 'Check your order', text: 'Open the bag icon to change quantities. The badge shows how many items you have.' },
  { n: 3, ico: '💬', title: 'Send on WhatsApp', text: 'Checkout and your order goes straight to our WhatsApp, ready to confirm.' },
  { n: 4, ico: '🍗', title: 'Enjoy', text: 'Collect it hot or have it delivered. We confirm the time with you.' },
];

export const why = [
  { ico: '🔥', title: 'Authentic smoke & spice', text: 'No shortcuts. The taste you remember from every family gathering.' },
  { ico: '🥬', title: 'Fresh every morning', text: 'Produce and chicken delivered daily and cooked the same day.' },
  { ico: '👨‍🍳', title: 'Passionate chefs', text: 'Every chicken is marinated overnight and grilled to order.' },
  { ico: '💰', title: 'Budget friendly', text: 'Generous portions that stay kind to your pocket.' },
  { ico: '👪', title: 'Built for families', text: 'A kids’ play zone and seating for the whole crew.' },
];
