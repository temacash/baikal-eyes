'use client';
import { useEffect, useRef } from 'react';
import { DPR, rng } from '@/lib/scenes';
import { LogoMark, LogoWord } from './Logo';

/** Заставка при первом открытии: байкальский лёд протаивает и открывает сайт. */
function drawFrostPattern(cv: HTMLCanvasElement) {
  const w = (cv.width = Math.round(window.innerWidth * DPR));
  const h = (cv.height = Math.round(window.innerHeight * DPR));
  const ctx = cv.getContext('2d')!;
  if (!ctx) return;
  const r = rng(2024), M = Math.min(w, h);

  /* толща байкальского льда: к центру светлее, к краям уходит в глубину */
  const g = ctx.createRadialGradient(w * .5, h * .44, M * .05, w * .5, h * .5, Math.max(w, h) * .8);
  g.addColorStop(0, 'rgba(138,203,226,.34)');
  g.addColorStop(.42, 'rgba(82,158,188,.55)');
  g.addColorStop(1, 'rgba(22,70,96,.82)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 28; i++) {                       // разводы и наплывы
    const x = r() * w, y = r() * h, rad = M * (.08 + r() * .24), a = .05 + r() * .13;
    const gg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    gg.addColorStop(0, r() > .5 ? 'rgba(169,229,245,' + a + ')' : 'rgba(16,56,78,' + a + ')');
    gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  /* белая трещина: ломаная с дрожанием и мягким свечением по кромке */
  function crack(x1: number, y1: number, x2: number, y2: number, wid: number, alpha: number) {
    const segs = 6 + ((r() * 5) | 0), dx = (x2 - x1) / segs, dy = (y2 - y1) / segs;
    let nx = -(y2 - y1), ny = x2 - x1;
    const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
    ctx.beginPath(); ctx.moveTo(x1, y1);
    for (let i = 1; i <= segs; i++) {
      const off = (r() - .5) * M * .022 * (1 - Math.abs(i / segs - .5) * 1.1);
      ctx.lineTo(x1 + dx * i + nx * off, y1 + dy * i + ny * off);
    }
    ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.lineWidth = wid; ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(214,241,252,.85)'; ctx.shadowBlur = wid * 3;
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  /* лёд колется на многоугольники: узлы + рёбра к ближайшим соседям */
  const pts: [number, number][] = [];
  for (let i = 0; i < 15; i++) pts.push([r() * w, r() * h]);
  for (let i = 0; i < 10; i++) {                        // узлы за краями — трещины уходят за экран
    const t = r(), o = M * .06, side = i % 4;
    pts.push((side === 0 ? [t * w, -o] : side === 1 ? [w + o, t * h] : side === 2 ? [t * w, h + o] : [-o, t * h]) as [number, number]);
  }
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j): [number, number] => [j, (q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1])])
      .filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]);
    const k = 2 + ((r() * 2) | 0);
    for (let n = 0; n < k && n < near.length; n++) {
      const q = pts[near[n][0]];
      crack(p[0], p[1], q[0], q[1], Math.max(1, DPR * (.6 + r() * 1.2)), .22 + r() * .38);
    }
  });

  for (let i = 0; i < 3; i++) {                         // становые щели во весь экран
    const y = r() * h;
    crack(-M * .06, y, w + M * .06, y + (r() - .5) * h * .38, Math.max(1.6, DPR * 2.2), .45 + r() * .3);
  }
  for (let i = 0; i < 26; i++) {                        // короткие ответвления
    const x = r() * w, y = r() * h, a = r() * Math.PI * 2, l = M * (.03 + r() * .09);
    crack(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, Math.max(.7, DPR * .7), .14 + r() * .25);
  }

  for (let i = 0; i < 150; i++) {                       // пузырьки воздуха во льду
    const x = r() * w, y = r() * h, s = (1 + r() * 3) * DPR;
    ctx.globalAlpha = .1 + r() * .45; ctx.fillStyle = '#F2FBFF';
    ctx.beginPath(); ctx.ellipse(x, y, s, s * (.5 + r() * .9), r() * 3, 0, 7); ctx.fill();
  }
  for (let i = 0; i < 16; i++) {                        // вертикальные цепочки пузырьков
    const x = r() * w, y = r() * h, n = 3 + ((r() * 6) | 0);
    for (let k = 0; k < n; k++) {
      const s = (1.3 + r() * 2.4) * DPR * (1 - (k / n) * .55);
      ctx.globalAlpha = .18 + r() * .42; ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.ellipse(x + (r() - .5) * M * .012, y + k * M * .014, s, s * 1.35, 0, 0, 7); ctx.fill();
    }
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
