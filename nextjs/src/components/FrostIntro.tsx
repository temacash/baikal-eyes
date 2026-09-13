'use client';
import { useEffect } from 'react';
import { DPR, rng } from '@/lib/scenes';
import { LogoMark, LogoWord } from './Logo';

/** Заставка при первом открытии: байкальский лёд трескается, разлетается осколками и тает. */
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

function drawImpact(cv: HTMLCanvasElement, cx: number, cy: number, rays: number) {
  const w = (cv.width = Math.round(window.innerWidth * DPR));
  const h = (cv.height = Math.round(window.innerHeight * DPR));
  const ctx = cv.getContext('2d')!;
  if (!ctx) return;
  const r = rng(313), M = Math.hypot(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(226,247,255,.95)';
  const X = cx * DPR, Y = cy * DPR;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + (r() - .5) * .4, len = M * (.35 + r() * .35);
    ctx.beginPath(); ctx.moveTo(X, Y);
    let x = X, y = Y;
    for (let k = 1; k <= 7; k++) {
      const t = k / 7;
      x = X + Math.cos(a) * len * t + (r() - .5) * M * .02;
      y = Y + Math.sin(a) * len * t + (r() - .5) * M * .02;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255,255,255,' + (.55 + r() * .4) + ')';
    ctx.lineWidth = (1.4 + r() * 2.2) * DPR; ctx.shadowBlur = 14 * DPR;
    ctx.stroke();
  }
  for (let k = 1; k <= 3; k++) {                       // кольцевые сколы
    const rad = M * (.08 + k * .11);
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2, rr = rad * (.86 + r() * .28);
      ctx[i ? 'lineTo' : 'moveTo'](X + Math.cos(a) * rr, Y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,' + (.3 + r() * .3) + ')';
    ctx.lineWidth = (1 + r() * 1.6) * DPR; ctx.shadowBlur = 10 * DPR; ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

/* разбиение экрана на осколки: узлы на лучах и кольцах — соседние куски делят рёбра */

type Shard = { el: HTMLCanvasElement; mx: number; my: number; dist: number; rnd: number };

function buildShards(src: HTMLCanvasElement, cx: number, cy: number, rays: number, rings: number): Shard[] {
  const w = window.innerWidth, h = window.innerHeight, r = rng(911);
  const maxR = Math.hypot(w, h) * .62;
  const ang: number[] = [], R: number[][] = [];
  for (let i = 0; i < rays; i++) ang.push((i / rays) * Math.PI * 2 + (r() - .5) * (Math.PI / rays) * .8);
  for (let i = 0; i < rays; i++) {
    R.push([0]);
    for (let k = 1; k <= rings; k++) {
      const base = maxR * Math.pow(k / rings, 1.25);
      R[i].push(k === rings ? maxR : Math.max(R[i][k - 1] + maxR * .12, base * (.8 + r() * .4)));
    }
  }
  const P = (i: number, k: number): [number, number] => [cx + Math.cos(ang[i % rays]) * R[i % rays][k], cy + Math.sin(ang[i % rays]) * R[i % rays][k]];
  const out: Shard[] = [];
  for (let i = 0; i < rays; i++) {
    for (let k = 0; k < rings; k++) {
      const poly: [number, number][] = k === 0
        ? [[cx, cy], P(i, 1), P(i + 1, 1)]
        : [P(i, k), P(i + 1, k), P(i + 1, k + 1), P(i, k + 1)];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      const bx = Math.max(-200, Math.min.apply(null, xs) - 1), by = Math.max(-200, Math.min.apply(null, ys) - 1);
      const bw = Math.min(w + 400, Math.max.apply(null, xs) + 1) - bx, bh = Math.min(h + 400, Math.max.apply(null, ys) + 1) - by;
      if (bw < 2 || bh < 2) continue;
      const cv = document.createElement('canvas');
      cv.width = Math.round(bw * DPR); cv.height = Math.round(bh * DPR);
      cv.style.cssText = 'left:' + bx + 'px;top:' + by + 'px;width:' + bw + 'px;height:' + bh + 'px';
      const ctx = cv.getContext('2d')!;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const path = () => {
        ctx.beginPath();
        poly.forEach((p, n) => ctx[n ? 'lineTo' : 'moveTo'](p[0] - bx, p[1] - by));
        ctx.closePath();
      };
      ctx.save(); path(); ctx.clip();
      ctx.drawImage(src, 0, 0, src.width, src.height, -bx, -by, w, h);
      ctx.restore();
      path();                                            // светящаяся кромка скола
      ctx.strokeStyle = 'rgba(240,252,255,.5)'; ctx.lineWidth = 1;
      ctx.shadowColor = 'rgba(200,238,252,.8)'; ctx.shadowBlur = 6; ctx.stroke(); ctx.shadowBlur = 0;
      const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
      out.push({ el: cv, mx, my, dist: Math.hypot(mx - cx, my - cy) / maxR, rnd: r() });
    }
  }
  return out;
}


function runIntro() {
  const q = <T extends Element>(sel: string) => document.querySelector<T>(sel);
  const fr = q<HTMLDivElement>('#frost'), lg = q<HTMLDivElement>('#frostlogo');
  const sh = q<HTMLDivElement>('#shards'), fl = q<HTMLDivElement>('#crackflash'), mt = q<HTMLDivElement>('#icemelt');
  const root = document.documentElement;
  const kill = () => {
    root.classList.remove('freezing');
    [fr, lg, sh, fl, mt].forEach((el) => el && el.remove());
  };
  if (!fr || !lg || !sh || !fl || !mt) return;
  let seen = false;
  try { seen = sessionStorage.getItem('be-frost') === '1'; } catch {}
  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { kill(); return; }
  try { sessionStorage.setItem('be-frost', '1'); } catch {}

  root.classList.add('freezing');
  const ice = q<HTMLCanvasElement>('#frostice');
  if (!ice) return;
  drawFrostPattern(ice);
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  const small = window.innerWidth < 700;
  const cx = window.innerWidth / 2, cy = window.innerHeight * .46;
  const rays = small ? 8 : 11, rings = small ? 2 : 3;

  let melting = false, progress = 0, raf = 0;
  const t0 = performance.now();
  raf = requestAnimationFrame(function wait(now: number) {          // индикатор, пока грузится фото
    if (melting) return;
    progress = Math.min(70, (now - t0) / 900 * 70);
    set('--f-p', progress.toFixed(1) + '%');
    raf = requestAnimationFrame(wait);
  });

  const img = document.querySelector<HTMLImageElement>('.hero__bg img');
  const loaded: Promise<unknown> = img && !img.complete
    ? new Promise((res) => { img.addEventListener('load', () => res(null), { once: true }); img.addEventListener('error', () => res(null), { once: true }); })
    : Promise.resolve();
  const minWait = new Promise((res) => setTimeout(res, 800));
  const timeout = new Promise((res) => setTimeout(res, 2800));

  Promise.race([Promise.all([loaded, minWait]), timeout]).then(() => {
    melting = true;
    cancelAnimationFrame(raf);
    set('--f-p', '100%');

    /* 1. удар: трещины вспыхивают, лёд вздрагивает */
    const crackCv = q<HTMLCanvasElement>('#crackcv');
    if (crackCv) drawImpact(crackCv, cx, cy, rays + 4);
    fr.classList.add('hit');
    fl.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: .7, offset: .45 }, { opacity: 0 }],
      { duration: 450, easing: 'ease-out', fill: 'forwards' });
    lg.animate([{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'scale(1.12)', filter: 'blur(9px)' }],
      { duration: 420, delay: 90, easing: 'ease-in', fill: 'forwards' });

    /* 2. лёд раскалывается и осколки уходят в глубину */
    setTimeout(() => {
      const shards = buildShards(ice, cx, cy, rays, rings);
      shards.forEach(s => sh.appendChild(s.el));
      fr.classList.add('gone');
      let last = 0;
      shards.forEach((s) => {
        const dirX = (s.mx - cx) || 1, dirY = (s.my - cy) || 1;
        const dx = dirX * (.22 + s.rnd * .55), dy = dirY * (.2 + s.rnd * .5) + 140 + s.rnd * 320;
        const dz = 140 + s.rnd * 460;
        const ax = s.rnd - .5, ay = (1 - s.rnd) - .5, az = s.rnd * .8 - .4;
        const turn = 70 + s.rnd * 210;
        const delay = s.dist * 200 + s.rnd * 80, dur = 820 + s.rnd * 480;
        last = Math.max(last, delay + dur);
        s.el.animate([
          { transform: 'translate3d(0,0,0) rotate3d(0,0,1,0deg) scale(1)', opacity: 1, filter: 'blur(0px)' },
          { transform: `translate3d(${dx * .5}px,${dy * .38}px,${dz * .65}px) rotate3d(${ax},${ay},${az},${turn * .45}deg) scale(1.02)`,
            opacity: .9, filter: 'blur(1px)', offset: .5 },
          { transform: `translate3d(${dx}px,${dy}px,${dz}px) rotate3d(${ax},${ay},${az},${turn}deg) scale(.88)`,
            opacity: 0, filter: 'blur(9px)' }
        ], { duration: dur, delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
      });

      /* 3. талая вода испаряется — и сайт открыт */
      setTimeout(() => {
        root.classList.remove('freezing');               // сайт оживает, пока тают последние осколки
        mt.animate([{ opacity: 0 }, { opacity: .45, offset: .25 }, { opacity: 0 }],
          { duration: 700, easing: 'ease-out', fill: 'forwards' });
        setTimeout(kill, 700);
      }, Math.max(300, last - 650));
    }, 190);
  });
}


export default function FrostIntro() {
  useEffect(() => {
    runIntro();
  }, []);

  return (
    <>
      <div className="frost" id="frost" aria-hidden="true"><canvas id="frostice" /></div>
      <div className="icemelt" id="icemelt" aria-hidden="true" />
      <div className="shards" id="shards" aria-hidden="true" />
      <div className="crackflash" id="crackflash" aria-hidden="true"><canvas id="crackcv" /></div>
      <div className="frostlogo" id="frostlogo" aria-hidden="true">
        <LogoMark />
        <LogoWord />
        <div className="bar"><i /></div>
        <small>Иркутск • Байкал • Ольхон</small>
      </div>
      <noscript><style>{`.frost,.frostlogo,.shards,.icemelt,.crackflash{display:none}`}</style></noscript>
    </>
  );
}
