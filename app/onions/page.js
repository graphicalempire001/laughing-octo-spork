'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_CATS = ['Pizzeria', 'Breakfast', 'African', 'Bakery', 'Chinese', 'Fast Food', 'Drinks', 'Sides'];
const EMPTY = { id: '', name: '', description: '', price: '', category: 'African', tag: '', available: true, img: '' };
const money = (n) => 'R' + (Number.isInteger(Number(n)) ? Number(n) : Number(n).toFixed(2));
const kb = (b) => (b < 1024 * 1024 ? Math.round(b / 1024) + ' KB' : (b / 1024 / 1024).toFixed(1) + ' MB');

// Shrinks and converts the chosen photo to WebP in the browser (saves mobile data). The server converts again as a guarantee.
async function toWebp(file) {
  try {
    const bmp = await createImageBitmap(file);
    const sc = Math.min(1, 1100 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * sc);
    c.height = Math.round(bmp.height * sc);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.74));
    if (blob && blob.type === 'image/webp') return blob;
  } catch {}
  return file;
}

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [blob, setBlob] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);

  const say = useCallback((text, bad = false) => {
    setToast({ text, bad });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const load = useCallback(async () => {
    const r = await fetch('/api/menu', { cache: 'no-store' });
    if (r.ok) setItems(await r.json());
  }, []);

  useEffect(() => {
    fetch('/api/onions/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        setAuthed(!!j.ok);
        if (j.ok) load();
      })
      .catch(() => setAuthed(false));
  }, [load]);

  const cats = useMemo(() => [...new Set([...DEFAULT_CATS, ...items.map((i) => i.category)])], [items]);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/onions/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { setAuthed(true); setPassword(''); load(); }
    else say(j.error || 'Could not sign in.', true);
  }
  async function logout() {
    await fetch('/api/onions/logout', { method: 'POST' });
    setAuthed(false);
  }

  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const b = await toWebp(f);
    setBlob(b);
    setPreview((old) => { if (old.startsWith('blob:')) URL.revokeObjectURL(old); return URL.createObjectURL(b); });
  }
  function reset() {
    setForm(EMPTY);
    setBlob(null);
    setPreview('');
    if (formRef.current) formRef.current.reset();
  }
  function edit(it) {
    setForm({ ...EMPTY, ...it, price: String(it.price) });
    setBlob(null);
    setPreview('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e) {
    e.preventDefault();
    if (!form.id && !blob) return say('Please choose a dish image.', true);
    setBusy(true);
    const fd = new FormData();
    fd.set('name', form.name);
    fd.set('description', form.description);
    fd.set('price', form.price);
    fd.set('category', form.category);
    fd.set('tag', form.tag);
    fd.set('available', String(form.available));
    if (blob) fd.set('image', blob, 'dish.webp');
    const r = await fetch(form.id ? `/api/menu/${form.id}` : '/api/menu', { method: form.id ? 'PUT' : 'POST', body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.status === 401) { setAuthed(false); return say('Session expired. Sign in again.', true); }
    if (!r.ok) return say(j.error || 'Could not save.', true);
    say(form.id ? 'Dish updated.' : 'Dish added to the menu.');
    reset();
    load();
  }
  async function toggle(it) {
    const fd = new FormData();
    fd.set('available', String(!(it.available !== false)));
    const r = await fetch(`/api/menu/${it.id}`, { method: 'PUT', body: fd });
    if (r.ok) { load(); say(it.available !== false ? 'Hidden from the public menu.' : 'Now showing on the menu.'); }
    else say('Could not update.', true);
  }
  async function remove(it) {
    if (!window.confirm(`Delete “${it.name}”? This cannot be undone.`)) return;
    const r = await fetch(`/api/menu/${it.id}`, { method: 'DELETE' });
    if (r.ok) { if (form.id === it.id) reset(); load(); say('Dish deleted.'); }
    else say('Could not delete.', true);
  }

  if (authed === null) return <main className="adm-wrap"><p className="adm-muted">Loading…</p></main>;

  if (!authed)
    return (
      <main className="adm-login">
        <form className="adm-card adm-loginbox" onSubmit={login}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-img big" src="/brand/logo.webp" alt="Ubuntu & Jollof" width="124" height="96" style={{ margin: '0 auto 14px' }} />
          <h1 className="heading">Menu admin</h1>
          <p className="adm-muted">Sign in to add and update dishes.</p>
          <label className="adm-label">Password
            <input className="adm-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
          </label>
          <button className="btn" type="submit" disabled={busy} style={{ width: '100%', marginTop: 8 }}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <a className="adm-muted adm-back" href="/" data-nofx>← Back to website</a>
        </form>
        {toast && <div className={`adm-toast${toast.bad ? ' bad' : ''}`}>{toast.text}</div>}
      </main>
    );

  const imgShown = preview || form.img;

  return (
    <main className="adm-wrap">
      <header className="adm-top">
        <div className="logo">{/* eslint-disable-next-line @next/next/no-img-element */}<img className="logo-img" src="/brand/logo.webp" alt="Ubuntu & Jollof" width="62" height="48" /><div className="logo-name">Menu admin</div></div>
        <div className="adm-top-btns">
          <a className="btn white sm" href="/" target="_blank" rel="noopener noreferrer">View site</a>
          <button className="btn dark sm" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="adm-grid">
        <form className="adm-card adm-form" onSubmit={save} ref={formRef}>
          <h2 className="heading">{form.id ? 'Edit dish' : 'Add a dish'}</h2>

          <div className="adm-drop">
            {imgShown ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgShown} alt="Dish preview" />
            ) : (
              <div className="adm-drop-empty"><span>📷</span>No image yet</div>
            )}
          </div>
          <label className="btn white sm adm-file" data-nofx>
            {imgShown ? 'Change image' : 'Choose image'}
            <input type="file" accept="image/*" onChange={pick} hidden />
          </label>
          <p className="adm-muted adm-small">
            {blob ? `Ready: ${kb(blob.size)} ${blob.type === 'image/webp' ? 'WebP' : '(converted to WebP when saved)'}` : 'Any photo works. It is shrunk and saved as a small WebP.'}
          </p>

          <label className="adm-label">Dish name
            <input className="adm-input" value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="adm-label">Description
            <textarea className="adm-input" rows={3} maxLength={220} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="adm-two">
            <label className="adm-label">Price (R)
              <input className="adm-input" type="number" inputMode="decimal" min="0" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="89" />
            </label>
            <label className="adm-label">Category
              <input className="adm-input" list="cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
          </div>
          <label className="adm-label">Badge (optional)
            <input className="adm-input" value={form.tag} maxLength={24} placeholder="Bestseller, New, Spicy…" onChange={(e) => setForm({ ...form, tag: e.target.value })} />
          </label>
          <label className="adm-check">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Show on the public menu
          </label>

          <div className="adm-actions">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : form.id ? 'Save changes' : 'Add to menu'}</button>
            {form.id && <button className="btn white" type="button" onClick={reset}>Cancel</button>}
          </div>
        </form>

        <section>
          <h2 className="heading adm-listtitle">Menu <span>{items.length} dishes</span></h2>
          <div className="adm-list">
            {items.map((it) => (
              <article key={it.id} className={`adm-item${it.available === false ? ' off' : ''}${form.id === it.id ? ' editing' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.img} alt="" />
                <div className="adm-info">
                  <strong>{it.name}</strong>
                  <span className="adm-muted">{it.category}{it.tag ? ` · ${it.tag}` : ''}</span>
                  <span className="adm-price">{money(it.price)}{it.available === false ? ' · hidden' : ''}</span>
                </div>
                <div className="adm-item-btns">
                  <button className="btn white sm" onClick={() => edit(it)}>Edit</button>
                  <button className="btn white sm" onClick={() => toggle(it)}>{it.available === false ? 'Show' : 'Hide'}</button>
                  <button className="btn dark sm" onClick={() => remove(it)}>Delete</button>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="adm-muted">No dishes yet. Add your first one.</p>}
          </div>
        </section>
      </div>
      {toast && <div className={`adm-toast${toast.bad ? ' bad' : ''}`}>{toast.text}</div>}
    </main>
  );
}
