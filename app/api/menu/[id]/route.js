import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { deleteItem, saveImage, updateItem } from '@/lib/store';
import { parseItem } from '@/lib/validate';

export const dynamic = 'force-dynamic';
const MAX = 12 * 1024 * 1024;

export async function PUT(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { id } = await params;
  const form = await req.formData();
  const { data, error } = parseItem(form, { partial: true });
  if (error) return NextResponse.json({ error }, { status: 400 });
  const file = form.get('image');
  if (file && typeof file !== 'string' && file.size) {
    if (file.size > MAX) return NextResponse.json({ error: 'Image is too large (max 12 MB).' }, { status: 400 });
    try {
      data.img = (await saveImage(Buffer.from(await file.arrayBuffer()))).src;
    } catch {
      return NextResponse.json({ error: 'That file is not a valid image.' }, { status: 400 });
    }
  }
  const item = await updateItem(id, data);
  return item ? NextResponse.json(item) : NextResponse.json({ error: 'Dish not found.' }, { status: 404 });
}

export async function DELETE(_req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { id } = await params;
  return (await deleteItem(id)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Dish not found.' }, { status: 404 });
}
