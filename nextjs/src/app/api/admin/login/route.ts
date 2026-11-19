import { NextRequest, NextResponse } from 'next/server';
import { COOKIE, adminConfigured, checkPassword, makeToken } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Простая защита от подбора: не больше 10 попыток за 10 минут с одного IP. */
const tries = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Админка не настроена: нет ADMIN_PASSWORD.' }, { status: 503 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const rec = tries.get(ip);
  if (rec && rec.until > now && rec.n >= 10) {
    return NextResponse.json({ ok: false, error: 'Слишком много попыток. Попробуйте через 10 минут.' }, { status: 429 });
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* пусто */ }

  if (!checkPassword(body.password)) {
    const next = rec && rec.until > now ? { n: rec.n + 1, until: rec.until } : { n: 1, until: now + 10 * 60 * 1000 };
    tries.set(ip, next);
    return NextResponse.json({ ok: false, error: 'Неверный пароль.' }, { status: 401 });
  }

  tries.delete(ip);
  const token = makeToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: token.maxAge,
  });
  return res;
}
