'use client';
import { useCart } from './CartProvider';

export default function AddButton({ item }) {
  const { items, add, inc, dec } = useCart();
  const qty = items.find((i) => i.id === item.id)?.qty || 0;
  if (!qty) {
    return (
      <button type="button" className="btn sm add-order" onClick={() => add(item)} aria-label={`Add ${item.name} to your order`}>
        + Add
      </button>
    );
  }
  return (
    <div className="stepper" role="group" aria-label={`${item.name} quantity`}>
      <button type="button" className="qty-btn" aria-label="Remove one" onClick={() => dec(item.id)}>−</button>
      <span aria-live="polite">{qty}</span>
      <button type="button" className="qty-btn" aria-label="Add one more" onClick={() => inc(item.id)}>+</button>
    </div>
  );
}
