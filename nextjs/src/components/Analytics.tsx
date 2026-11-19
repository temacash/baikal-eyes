'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { metrikaHit } from '@/lib/metrika';

/* Счётчик Baikal Eyes.
   Анонимный: в браузере посетителя хранится случайный id, IP и персональные данные не пишутся.
   Отправка — sendBeacon, поэтому не тормозит страницу и переживает закрытие вкладки. */

const VID = 'be_vid';
const SID = 'be_sid';
const SID_TS = 'be_sid_ts';
const SESSION_MIN = 30;

function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function ids(): { vid: string; sid: string; isNew: boolean } | null {
  try {
    let vid = localStorage.getItem(VID);
    const isNew = !vid;
    if (!vid) { vid = uid(); localStorage.setItem(VID, vid); }

    const last = Number(sessionStorage.getItem(SID_TS) || 0);
    let sid = sessionStorage.getItem(SID);
    if (!sid || Date.now() - last > SESSION_MIN * 60000) sid = uid();
    sessionStorage.setItem(SID, sid);
    sessionStorage.setItem(SID_TS, String(Date.now()));
    return { vid, sid, isNew };
  } catch {
    return null; // приватный режим / хранилище заблокировано — просто не считаем
  }
}

function send(payload: Record<string, unknown>) {
  const id = ids();
  if (!id) return;
  const body = JSON.stringify({ ...payload, vid: id.vid, sid: id.sid, isNew: id.isNew });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      return;
    }
  } catch { /* дальше — обычный fetch */ }
  fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
}

/** Публичный помощник: отправить событие из любого компонента. */
export function track(label: string, extra?: { tour?: string }) {
  send({ type: 'click', label, path: location.pathname, tour: extra?.tour });
}

function Tracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  const last = useRef<string>('');
  const prevHref = useRef<string>('');

  // просмотр страницы
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const key = pathname + '?' + params.toString();
    if (last.current === key) return;
    const prevUrl = prevHref.current;
    last.current = key;
    prevHref.current = location.href;

    // Первый просмотр Метрика считает сама при init; дальше Next.js меняет страницы
    // без перезагрузки — каждый такой переход отправляем в Метрику вручную.
    if (prevUrl) metrikaHit(location.href, prevUrl);

    send({
      type: 'pageview',
      path: pathname,
      title: document.title,
      referrer: document.referrer || null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      lang: navigator.language,
    });
  }, [pathname, params]);

  // клики по контактам и кнопкам бронирования
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('a,button') as HTMLAnchorElement | HTMLButtonElement | null;
      if (!el) return;

      const explicit = el.getAttribute('data-track');
      const href = (el as HTMLAnchorElement).href || '';
      let label = explicit || '';
      if (!label) {
        if (href.startsWith('tel:')) label = 'phone';
        else if (/t\.me\/baikal_eyes/.test(href)) label = 'channel';
        else if (/t\.me\//.test(href)) label = 'telegram';
        else if (/instagram\.com/.test(href)) label = 'instagram';
      }
      if (!label) return;

      send({
        type: 'click',
        label,
        path: location.pathname,
        tour: el.getAttribute('data-tour') || document.querySelector('h1')?.textContent?.trim() || null,
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
