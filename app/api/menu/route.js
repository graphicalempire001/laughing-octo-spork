import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createItem, getMenu, saveImage } from '@/lib/store';
import { parseItem } from '@/lib/validate';

export const dynamic = 'force-dynamic';
const MAX = 12 * 1024 * 1024;

export async function GET() {
  const items = await getMenu();
  return NextResponse.json((await isAdmin()) ? items : items.filter((i) => i.available !== false));
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const form = await req.formData();
  const { data, error } = parseItem(form);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const file = form.get('image');
  if (!file || typeof file === 'string' || !file.size) return NextResponse.json({ error: 'Please add a dish image.' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'Image is too large (max 12 MB).' }, { status: 400 });
  try {
    const { src } = await saveImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json(await createItem({ ...data, img: src }), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'That file is not a valid image.' }, { status: 400 });
  }
}
