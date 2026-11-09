import CartProvider from '@/components/CartProvider';
import CartDrawer from '@/components/CartDrawer';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import ToTop from '@/components/ToTop';

export default function SiteLayout({ children }) {
  return (
    <CartProvider>
      <Loader />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <FloatingCart />
      <ToTop />
    </CartProvider>
  );
}
