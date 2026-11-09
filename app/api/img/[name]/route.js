import { readUpload } from '@/lib/store';

export async function GET(_req, { params }) {
  const { name } = await params;
  if (!/^[a-z0-9-]+\.webp$/i.test(name)) return new Response('Not found', { status: 404 });
  try {
    const buf = await readUpload(name);
    return new Response(buf, {
      headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
