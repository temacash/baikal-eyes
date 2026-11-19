import { NextRequest, NextResponse } from 'next/server';
import { insert } from '@/lib/db';
import { parseUa, refHost } from '@/lib/ua';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const str = (v: unknown, max = 400) => (typeof v === 'string' ? v.slice(0, max) : null);

/** Город и страну даёт Vercel в заголовках запроса — сам IP мы не храним. */
function geo(req: NextRequest) {
  const dec = (h: string) => {
    const v = req.headers.get(h);
    if (!v) return null;
    try { return decodeURIComponent(v); } catch { return v; }
  };
  return {
    country: dec('x-vercel-ip-country'),
    region: dec('x-vercel-ip-country-region'),
    city: dec('x-vercel-ip-city'),
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const ua = parseUa(req.headers.get('user-agent'));
  if (ua.bot) return new NextResponse(null, { status: 204 }); // роботов не считаем

  const vid = str(body.vid, 40);
  const sid = str(body.sid, 40);
  if (!vid || !sid) return new NextResponse(null, { status: 204 });

  const g = geo(req);
  const host = req.headers.get('host') || '';
  const type = body.type === 'click' ? 'click' : 'pageview';

  if (type === 'click') {
    await insert('events', {
      visitor_id: vid,
      session_id: sid,
      type: 'click',
      label: str(body.label, 40),
      path: str(body.path, 300),
      tour: str(body.tour, 200),
      city: g.city,
      device: ua.device,
    });
  } else {
    const referrer = str(body.referrer, 500);
    await insert('visits', {
      visitor_id: vid,
      session_id: sid,
      is_new: body.isNew === true,
      path: str(body.path, 300) || '/',
      title: str(body.title, 200),
      referrer,
      ref_host: refHost(referrer, host),
      utm_source: str(body.utm_source, 80),
      utm_medium: str(body.utm_medium, 80),
      utm_campaign: str(body.utm_campaign, 120),
      country: g.country,
      region: g.region,
      city: g.city,
      device: ua.device,
      os: ua.os,
      browser: ua.browser,
      screen: str(body.screen, 20),
      lang: str(body.lang, 20),
    });
  }

  return new NextResponse(null, { status: 204 });
}
