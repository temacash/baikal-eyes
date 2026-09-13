'use client';
import { useEffect, useRef } from 'react';
import { DPR, rng } from '@/lib/scenes';
import { LogoMark, LogoWord } from './Logo';

/** Заставка при первом открытии: морозное стекло протаивает и открывает сайт. */
function drawFrostPattern(cv: HTMLCanvasElement) {
  const w = (cv.width = Math.round(window.innerWidth * DPR));
  const h = (cv.height = Math.round(window.innerHeight * DPR));
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const r = rng(2024);

  const g = ctx.createRadialGradient(w / 2, h * 0.46, Math.min(w, h) * 0.12, w / 2, h * 0.5, Math.max(w, h) * 0.72);
  g.addColorStop(0, 'rgba(200,235,250,.04)');
  g.addColorStop(0.55, 'rgba(190,228,245,.15)');
  g.addColorStop(1, 'rgba(214,242,252,.42)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const branch = (x: number, y: number, ang: number, len: number, depth: number, wid: number) => {
    if (depth <= 0 || len < 3) return;
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    ctx.strokeStyle = `rgba(228,247,255,${0.05 + depth * 0.045})`;
    ctx.lineWidth = wid;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    const n = 2 + ((r() * 2) | 0);
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), bx = x + (x2 - x) * t, by = y + (y2 - y) * t, s = len * (0.26 + r() * 0.3);
      for (const k of [-1, 1]) {
        const a = ang + k * (Math.PI / 3) * (0.8 + r() * 0.4);
        const ex = bx + Math.cos(a) * s, ey = by + Math.sin(a) * s;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
        if (depth > 2 && r() > 0.62) branch(ex, ey, a, s * 0.55, depth - 2, Math.max(0.4, wid * 0.7));
      }
    }
    branch(x2, y2, ang + (r() - 0.5) * 0.5, len * 0.72, depth - 1, Math.max(0.4, wid * 0.82));
  };

  for (let i = 0; i < 30; i++) {
    const side = i % 4, t = r();
    let x: number, y: number, a: number;
    if (side === 0) { x = t * w; y = 0; a = Math.PI / 2 + (r() - 0.5) * 0.9; }
    else if (side === 1) { x = w; y = t * h; a = Math.PI + (r() - 0.5) * 0.9; }
    else if (side === 2) { x = t * w; y = h; a = -Math.PI / 2 + (r() - 0.5) * 0.9; }
    else { x = 0; y = t * h; a = (r() - 0.5) * 0.9; }
    branch(x, y, a, Math.min(w, h) * (0.08 + r() * 0.13), 4, Math.max(0.8, DPR));
  }
  for (let i = 0; i < 170; i++) {
    const x = r() * w, y = r() * h, s = (1 + r() * 2.4) * DPR;
    ctx.globalAlpha = 0.08 + r() * 0.45;
    ctx.fillStyle = '#EAF7FD';
    ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3; ctx[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * s, y + Math.sin(a) * s); }
    ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export default function FrostIntro() {
  const iceRef = useRef<HTMLCanvasElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const kill = () => {
      root.classList.remove('freezing');
      frostRef.current?.remove();
      logoRef.current?.remove();
    };
    let seen = false;
    try { seen = sessionStorage.getItem('be-frost') === '1'; } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { kill(); return; }
    try { sessionStorage.setItem('be-frost', '1'); } catch {}

    root.classList.add('freezing');
    if (iceRef.current) drawFrostPattern(iceRef.current);
    const set = (k: string, v: string) => root.style.setProperty(k, v);

    let melting = false, progress = 0, raf = 0;
    const t0 = performance.now();
    const wait = (now: number) => {                       // индикатор, пока грузится фото
      if (melting) return;
      progress = Math.min(70, ((now - t0) / 900) * 70);
      set('--f-p', progress.toFixed(1) + '%');
      raf = requestAnimationFrame(wait);
    };
    raf = requestAnimationFrame(wait);

    const img = document.querySelector<HTMLImageElement>('.hero__bg img');
    const loaded = img && !img.complete
      ? new Promise<void>((res) => {
          img.addEventListener('load', () => res(), { once: true });
          img.addEventListener('error', () => res(), { once: true });
        })
      : Promise.resolve();
    const minWait = new Promise<void>((res) => setTimeout(res, 700));
    const timeout = new Promise<void>((res) => setTimeout(res, 2800));

    Promise.race([Promise.all([loaded, minWait]), timeout]).then(() => {
      melting = true;
      cancelAnimationFrame(raf);
      const start = performance.now(), dur = 2000;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur), e = ease(p);
        const r1 = e * 190, r0 = Math.max(0, r1 - 16);
        set('--f-r0', r0.toFixed(1) + '%');
        set('--f-r1', r1.toFixed(1) + '%');
        set('--f-blur', (26 * (1 - e)).toFixed(1) + 'px');
        set('--f-bg', (0.62 * (1 - e)).toFixed(3));
        set('--f-ice', Math.max(0, 1 - e * 1.4).toFixed(3));
        set('--f-p', (progress + (100 - progress) * Math.min(1, p / 0.45)).toFixed(1) + '%');
        const vis = p < 0.38 ? 1 : Math.max(0, 1 - (p - 0.38) / 0.4);
        set('--f-lg', vis.toFixed(3));
        set('--f-lgs', (1 + (1 - vis) * 0.07).toFixed(3));
        set('--f-lgb', ((1 - vis) * 8).toFixed(1) + 'px');
        if (p < 1) requestAnimationFrame(step); else kill();
      };
      requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="frost" id="frost" aria-hidden="true" ref={frostRef}>
        <canvas ref={iceRef} />
      </div>
      <div className="frostlogo" aria-hidden="true" ref={logoRef}>
        <LogoMark />
        <LogoWord />
        <div className="bar"><i /></div>
        <small>Иркутск • Байкал • Ольхон</small>
      </div>
      <noscript><style>{`.frost,.frostlogo{display:none}`}</style></noscript>
    </>
  );
}
