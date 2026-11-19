import { NextRequest, NextResponse } from 'next/server';
import { COOKIE, verifyToken, adminConfigured } from '@/lib/admin-auth';
import { dbReady, select, update } from '@/lib/db';
import { TOURS } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Visit = {
  ts: string; visitor_id: string; session_id: string; is_new: boolean;
  path: string; title: string | null; ref_host: string | null;
  city: string | null; country: string | null;
  device: string | null; os: string | null; browser: string | null;
};
type Ev = { ts: string; label: string | null; path: string | null; tour: string | null; city: string | null };
type Lead = {
  id: number; ts: string; name: string | null; contact: string | null; people: string | null;
  want_date: string | null; note: string | null; tour: string | null; path: string | null;
  city: string | null; device: string | null; status: string;
};

const authed = (req: NextRequest) => verifyToken(req.cookies.get(COOKIE)?.value);

/* ─────────── helpers ─────────── */

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

function top(rows: (string | null | undefined)[], limit = 8, empty = '—') {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = (r && String(r).trim()) || empty;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

const TITLE_BY_PATH = new Map<string, string>(
  TOURS.map((t) => [`/${t.slug}`, t.title] as [string, string])
);

function pageName(path: string): string {
  if (path === '/') return 'Главная';
  if (path === '/tours') return 'Туры';
  if (path === '/excursions') return 'Экскурсии';
  if (path === '/about') return 'О нас';
  if (path === '/contacts') return 'Контакты';
  if (path === '/packing') return 'Что взять с собой';
  const slug = path.split('/').filter(Boolean).pop() || '';
  return TITLE_BY_PATH.get(`/${slug}`) || path;
}

const isRoute = (p: string) => /^\/(tours|excursions)\/[^/]+$/.test(p);

/* ─────────── GET: вся сводка ─────────── */

export async function GET(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'not_configured', message: 'Не задан ADMIN_PASSWORD.' }, { status: 503 });
  }
  if (!authed(req)) return NextResponse.json({ error: 'auth' }, { status: 401 });
  if (!dbReady()) {
    return NextResponse.json({ error: 'no_db', message: 'Не заданы SUPABASE_URL и SUPABASE_SERVICE_KEY.' }, { status: 503 });
  }

  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get('days')) || 30, 1), 365);
  const from = new Date(Date.now() - days * 864e5).toISOString();

  const [visits, events, leads] = await Promise.all([
    select<Visit>('visits', `select=ts,visitor_id,session_id,is_new,path,title,ref_host,city,country,device,os,browser&ts=gte.${from}&order=ts.desc&limit=20000`),
    select<Ev>('events', `select=ts,label,path,tour,city&ts=gte.${from}&order=ts.desc&limit=20000`),
    select<Lead>('leads', `select=*&order=ts.desc&limit=200`),
  ]);

  // ряд по дням
  const byDay = new Map<string, { visits: number; visitors: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    byDay.set(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10), { visits: 0, visitors: new Set() });
  }
  for (const v of visits) {
    const k = dayKey(v.ts);
    const cell = byDay.get(k);
    if (cell) { cell.visits++; cell.visitors.add(v.visitor_id); }
  }
  const series = [...byDay.entries()].map(([d, c]) => ({ d, visits: c.visits, visitors: c.visitors.size }));

  const today = new Date().toISOString().slice(0, 10);
  const todayRows = visits.filter((v) => dayKey(v.ts) === today);
  const sessions = new Set(visits.map((v) => v.session_id));
  const visitors = new Set(visits.map((v) => v.visitor_id));
  const freshVisitors = new Set(visits.filter((v) => v.is_new).map((v) => v.visitor_id));

  return NextResponse.json({
    ok: true,
    days,
    summary: {
      views: visits.length,
      visitors: visitors.size,
      sessions: sessions.size,
      perSession: sessions.size ? +(visits.length / sessions.size).toFixed(1) : 0,
      newShare: visitors.size ? Math.round((freshVisitors.size / visitors.size) * 100) : 0,
      todayViews: todayRows.length,
      todayVisitors: new Set(todayRows.map((v) => v.visitor_id)).size,
      leads: leads.filter((l) => new Date(l.ts).toISOString() >= from).length,
      leadsNew: leads.filter((l) => l.status === 'new').length,
      clicks: events.length,
    },
    series,
    pages: top(visits.map((v) => pageName(v.path))),
    routes: top(visits.filter((v) => isRoute(v.path)).map((v) => pageName(v.path))),
    sources: top(visits.map((v) => v.ref_host)),
    cities: top(visits.map((v) => v.city), 8, 'Не определён'),
    devices: top(visits.map((v) => (v.device === 'phone' ? 'Телефон' : v.device === 'tablet' ? 'Планшет' : 'Компьютер')), 3),
    browsers: top(visits.map((v) => v.browser), 6),
    clicks: top(events.map((e) => LABELS[e.label || ''] || e.label), 8),
    clicksByTour: top(events.filter((e) => e.tour).map((e) => e.tour), 8),
    recent: visits.slice(0, 200).map((v) => ({
      ts: v.ts, page: pageName(v.path), path: v.path,
      city: v.city, country: v.country, device: v.device,
      os: v.os, browser: v.browser, source: v.ref_host, isNew: v.is_new,
    })),
    leads: leads.slice(0, 100),
  });
}

const LABELS: Record<string, string> = {
  book: 'Кнопка «Забронировать»',
  form: 'Отправлена форма',
  telegram: 'Telegram',
  channel: 'Telegram-канал',
  phone: 'Звонок по номеру',
  instagram: 'Instagram',
};

/* ─────────── PATCH: статус заявки ─────────── */

export async function PATCH(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'auth' }, { status: 401 });
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* пусто */ }
  const id = Number(b.id);
  const status = String(b.status || '');
  if (!id || !['new', 'in_work', 'done', 'spam'].includes(status)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = await update('leads', id, { status });
  return NextResponse.json({ ok });
}
