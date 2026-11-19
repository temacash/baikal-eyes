import { NextRequest, NextResponse } from 'next/server';
import { insert } from '@/lib/db';
import { parseUa } from '@/lib/ua';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : null);

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const name = str(b.name, 120);
  const contact = str(b.contact, 160);
  if (!name && !contact) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = parseUa(req.headers.get('user-agent'));
  const cityRaw = req.headers.get('x-vercel-ip-city');
  let city: string | null = null;
  try { city = cityRaw ? decodeURIComponent(cityRaw) : null; } catch { city = cityRaw; }

  const ok = await insert('leads', {
    name,
    contact,
    people: str(b.people, 20),
    want_date: str(b.date, 40),
    note: str(b.note, 2000),
    tour: str(b.tour, 200),
    path: str(b.path, 300),
    visitor_id: str(b.vid, 40),
    city,
    device: ua.device,
  });

  return NextResponse.json({ ok });
}
