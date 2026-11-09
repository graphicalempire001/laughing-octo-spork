'use client';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { money } from '@/lib/format';

export default function FloatingCart() {
  const { count, total, open, setOpen } = useCart();
  const path = usePathname();
  if (!count || open || path === '/order') return null;
  return (
    <button type="button" className="btn float-cart" onClick={() => setOpen(true)} aria-label={`View your order, ${count} items`}>
      🛍️ View order <span className="float-badge">{count}</span> · {money(total)}
    </button>
  );
}
