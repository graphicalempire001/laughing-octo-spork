// Validates the multipart form for create/update. `partial` = only check fields that were sent.
export function parseItem(form, { partial = false } = {}) {
  const out = {};
  const has = (k) => form.has(k);
  const str = (k, max) => String(form.get(k) ?? '').trim().slice(0, max);

  if (!partial || has('name')) {
    out.name = str('name', 80);
    if (!out.name) return { error: 'Dish name is required.' };
  }
  if (!partial || has('description')) out.description = str('description', 220);
  if (!partial || has('price')) {
    const p = Number(String(form.get('price')).replace(',', '.'));
    if (!Number.isFinite(p) || p < 0 || p > 100000) return { error: 'Enter a valid price in Rands.' };
    out.price = Math.round(p * 100) / 100;
  }
  if (!partial || has('category')) out.category = str('category', 30) || 'Other';
  if (!partial || has('tag')) out.tag = str('tag', 24);
  if (!partial || has('available')) out.available = String(form.get('available')) !== 'false';
  return { data: out };
}
