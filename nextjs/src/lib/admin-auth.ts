/* Вход в админку: один пароль из переменной окружения + подписанная кука.
   Пароль никогда не хранится в куке — там лежит срок действия и HMAC-подпись. */

import { createHmac, timingSafeEqual } from 'crypto';

export const COOKIE = 'be_admin';
const TTL_DAYS = 14;

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sign(exp: number): string {
  return createHmac('sha256', secret()).update(String(exp)).digest('hex');
}

export function makeToken(): { value: string; maxAge: number } {
  const maxAge = TTL_DAYS * 24 * 60 * 60;
  const exp = Date.now() + maxAge * 1000;
  return { value: `${exp}.${sign(exp)}`, maxAge };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [expStr, mac] = token.split('.');
  const exp = Number(expStr);
  if (!exp || !mac || Date.now() > exp) return false;
  return safeEqual(mac, sign(exp));
}

export function checkPassword(input: unknown): boolean {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass || typeof input !== 'string') return false;
  return safeEqual(input, pass);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
