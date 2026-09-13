/* Кинематографичные сцены Байкала, нарисованные на canvas.
   Заменить на фотографии: см. компонент <Scene />. */
type Ctx = CanvasRenderingContext2D;
type R = () => number;

export const DPR = typeof window === 'undefined' ? 1 : Math.min(2, window.devicePixelRatio || 1);
export const rng = (seed: number): R => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

let noisePat: CanvasPattern | null = null;
function grainPattern(ctx: Ctx): CanvasPattern {
  if (noisePat) return noisePat;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!, im = g.createImageData(128, 128), r = rng(7);
  for (let i = 0; i < im.data.length; i += 4) { const v = 120 + r() * 135; im.data[i] = im.data[i+1] = im.data[i+2] = v; im.data[i+3] = 255; }
  g.putImageData(im, 0, 0); noisePat = ctx.createPattern(c, 'repeat'); return noisePat!;
}
function grad(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((s) => g.addColorStop(Math.max(0, Math.min(1, s[0])), s[1])); return g;
}
/* силуэт хребта: сумма гармоник + камни */
function ridgePath(ctx: Ctx, W: number, H: number, baseY: number, amp: number, rough: number, r: R, dir?: number) {
  const ph = [r() * 9, r() * 9, r() * 9, r() * 9];
  const k = dir || 1;
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += Math.max(2, W / 220)) {
    const t = x / W;
    let y = baseY
      + Math.sin(t * 2.1 * Math.PI + ph[0]) * amp * .55 * k
      + Math.sin(t * 4.7 * Math.PI + ph[1]) * amp * .3
      + Math.sin(t * 9.3 * Math.PI + ph[2]) * amp * .14 * rough
      + Math.sin(t * 19.1 * Math.PI + ph[3]) * amp * .06 * rough;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H); ctx.closePath();
}
function haze(ctx: Ctx, W: number, H: number, y0: number, y1: number, color: string, a: number) {
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = grad(ctx, 0, y0, 0, y1, [[0, color.replace('ALPHA', String(a))], [1, color.replace('ALPHA', String(0))]]);
  ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0)); ctx.restore();
}
function softGlow(ctx: Ctx, x: number, y: number, r: number, color: string, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace('ALPHA', String(a))); g.addColorStop(.45, color.replace('ALPHA', String(a * .35)));
  g.addColorStop(1, color.replace('ALPHA', String(0)));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function cracks(ctx: Ctx, x: number, y: number, len: number, ang: number, depth: number, r: R, w: number, col: string) {
  if (depth <= 0 || len < 4) return;
  const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
  const n = r() > .45 ? 2 : 1;
  for (let i = 0; i < n; i++) cracks(ctx, x2, y2, len * (.5 + r() * .28), ang + (r() - .5) * 1.5, depth - 1, r, Math.max(.3, w * .7), col);
}
function stars(ctx: Ctx, W: number, H: number, upto: number, r: R, density: number) {
  for (let i = 0; i < density; i++) {
    const x = r() * W, y = r() * upto, s = r();
    ctx.globalAlpha = (1 - y / upto) * (.25 + s * .75) * .9;
    ctx.fillStyle = s > .93 ? '#CFEAF5' : '#FFFFFF';
    ctx.fillRect(x, y, s > .96 ? 1.6 : 1, s > .96 ? 1.6 : 1);
  }
  ctx.globalAlpha = 1;
}
function waterBody(ctx: Ctx, W: number, H: number, hz: number, c1: string, c2: string, sunX: number | null, sunCol: string | null, r: R, shimmer: number) {
  ctx.fillStyle = grad(ctx, 0, hz, 0, H, [[0, c1], [1, c2]]);
  ctx.fillRect(0, hz, W, H - hz);
  if (sunX != null) { // солнечная дорожка — мягкие блики, а не полосы
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 150; i++) {
      const t = Math.pow(i / 150, 1.1), y = hz + t * (H - hz);
      const spread = W * (.014 + t * .21), w = spread * (.2 + r() * .85);
      ctx.globalAlpha = (1 - t) * .26 * (.25 + r() * .75);
      ctx.fillStyle = sunCol as string;
      ctx.beginPath(); ctx.ellipse(sunX + (r() - .5) * spread * 1.4, y, w * .5, Math.max(.6, (H - hz) * .004 * (1 + t * 2.2)), 0, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  for (let i = 0; i < 120; i++) { // блики на воде
    const t = Math.pow(r(), .55), y = hz + t * (H - hz), w = W * (.012 + t * .09) * r();
    ctx.globalAlpha = (1 - t) * .13 * shimmer; ctx.fillStyle = '#CFEAF5';
    ctx.beginPath(); ctx.ellipse(r() * W, y, w * .5, Math.max(.5, (H - hz) * .0032), 0, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function vignette(ctx: Ctx, W: number, H: number, a: number) {
  const g = ctx.createRadialGradient(W / 2, H * .48, Math.min(W, H) * .25, W / 2, H * .5, Math.max(W, H) * .78);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,8,12,' + a + ')');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function finish(ctx: Ctx, W: number, H: number, vig?: number) {
  vignette(ctx, W, H, vig == null ? .55 : vig);
  ctx.save(); ctx.globalAlpha = .05; ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = grainPattern(ctx); ctx.fillRect(0, 0, W, H); ctx.restore();
}

/* ---------- сцены ---------- */
export const SCENES: Record<string, (ctx: Ctx, W: number, H: number, r: R) => void> = {
  /* Рассвет над Байкалом — главный экран */
  dawn(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .63;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#061018'], [.32, '#0C2739'], [.6, '#1B5570'], [.84, '#4A93AE'], [1, '#A3D2E2']]);
    ctx.fillRect(0, 0, W, hz);
    stars(ctx, W, H * .42, H * .42, r, 210);
    softGlow(ctx, W * .68, hz - H * .02, W * .58, 'rgba(243,193,141,ALPHA)', .5);
    softGlow(ctx, W * .68, hz, W * .2, 'rgba(255,224,190,ALPHA)', .5);
    // дальние хребты
    ([[.585, .028, '#2B6A82', .5], [.605, .042, '#1B4C63', .9], [.622, .03, '#123A4E', 1.3]] as [number, number, string, number][]).forEach((L, i) => {
      ctx.fillStyle = L[2]; ridgePath(ctx, W, hz + 2, H * L[0], H * L[1], L[3], r, i % 2 ? -1 : 1); ctx.fill();
      haze(ctx, W, H, H * L[0] - H * .03, hz, 'rgba(122,180,204,ALPHA)', .16);
    });
    ctx.fillStyle = grad(ctx, 0, hz - H * .1, 0, hz, [[0, 'rgba(180,215,230,0)'], [1, 'rgba(198,226,238,.30)']]);
    ctx.fillRect(0, hz - H * .1, W, H * .1);
    waterBody(ctx, W, H, hz, '#123B50', '#060C12', W * .68, 'rgba(247,208,163,.85)', r, 1);
    // ледяные пластины на переднем плане
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const y = hz + (H - hz) * (.42 + r() * .6), sc = (y - hz) / (H - hz);
      const x = r() * W, w = W * (.06 + sc * .2), h = (H - hz) * .05 * (.5 + sc);
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + w * .34, y - h); ctx.lineTo(x + w, y - h * .6); ctx.lineTo(x + w * .72, y + h * .35); ctx.closePath();
      ctx.fillStyle = 'rgba(163,210,228,' + (.10 + sc * .3) + ')'; ctx.fill();
      ctx.strokeStyle = 'rgba(214,240,250,' + (.2 + sc * .4) + ')'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();
    finish(ctx, W, H, .6);
  },

  /* Зимний Байкал — прозрачный лёд и трещины */
  ice(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .38;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0B1C29'], [.42, '#1D5470'], [.78, '#6BA8C0'], [1, '#CFE9F2']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .26, hz - H * .06, W * .44, 'rgba(255,246,228,ALPHA)', .55);
    ctx.fillStyle = 'rgba(28,74,96,.85)'; ridgePath(ctx, W, hz + 2, hz - H * .02, H * .022, .7, r, 1); ctx.fill();
    ctx.fillStyle = 'rgba(13,42,58,.95)'; ridgePath(ctx, W, hz + 2, hz - H * .004, H * .012, 1.2, r, -1); ctx.fill();
    haze(ctx, W, H, hz - H * .05, hz, 'rgba(205,234,245,ALPHA)', .45);
    // ледяное поле в перспективе
    ctx.fillStyle = grad(ctx, 0, hz, 0, H, [[0, '#9CC9DC'], [.1, '#3E7E98'], [.34, '#1B4A63'], [.72, '#0E2A3B'], [1, '#081521']]);
    ctx.fillRect(0, hz, W, H - hz);
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 10; i++) { // становые щели, уходящие к горизонту
      let x = (i / 10 + r() * .09) * W * 1.34 - W * .17, y = hz + (H - hz) * .03;
      ctx.beginPath(); ctx.moveTo(x, y);
      while (y < H) { y += (H - hz) * (.05 + r() * .09); x += (x - W / 2) * .11 + (r() - .5) * W * .045; ctx.lineTo(x, y); }
      ctx.strokeStyle = 'rgba(196,236,250,' + (.14 + r() * .22) + ')'; ctx.lineWidth = Math.max(.8, W * .0016); ctx.stroke();
    }
    for (let i = 0; i < 5; i++) { // поперечные трещины
      const y = hz + (H - hz) * (.18 + r() * .72);
      ctx.beginPath(); ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += W / 24) ctx.lineTo(x, y + (r() - .5) * (H - hz) * .05);
      ctx.strokeStyle = 'rgba(214,244,255,' + (.09 + r() * .15) + ')'; ctx.lineWidth = Math.max(1, W * .0022); ctx.stroke();
    }
    ctx.restore();
    for (let i = 0; i < 95; i++) { // пузыри метана подо льдом
      const t = Math.pow(r(), 1.5), y = hz + (H - hz) * (.08 + t * .92);
      const s = Math.max(1, W * .002 + t * W * .009) * (.5 + r()), x = r() * W, a = .16 + t * .5;
      ctx.globalAlpha = a; ctx.fillStyle = 'rgba(226,247,255,.85)';
      ctx.beginPath(); ctx.ellipse(x, y, s, s * .72, 0, 0, 7); ctx.fill();
      ctx.globalAlpha = a * .55; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.ellipse(x, y, s * 1.55, s * 1.08, 0, 0, 7); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 11; i++) { // осколки на переднем плане
      const y = hz + (H - hz) * (.45 + r() * .6), sc = Math.min(1, (y - hz) / (H - hz));
      const x = r() * W, w = W * (.05 + sc * .17), h = (H - hz) * (.05 + sc * .1);
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + w * (.2 + r() * .2), y - h * (.7 + r() * .6));
      ctx.lineTo(x + w * (.6 + r() * .3), y - h * (.3 + r() * .4));
      ctx.lineTo(x + w, y + h * .18); ctx.closePath();
      ctx.fillStyle = 'rgba(150,206,228,' + (.1 + sc * .22) + ')'; ctx.fill();
      ctx.strokeStyle = 'rgba(226,248,255,' + (.28 + sc * .45) + ')'; ctx.lineWidth = Math.max(.8, W * .0014); ctx.stroke();
    }
    finish(ctx, W, H, .5);
  },

  /* Ледяной грот */
  grotto(ctx: Ctx, W: number, H: number, r: R) {
    // вид изнутри грота наружу
    ctx.fillStyle = grad(ctx, 0, 0, 0, H, [[0, '#D3EBF4'], [.34, '#8CC3D8'], [.5, '#3C7E98'], [.62, '#1B4C64'], [1, '#0A1C28']]);
    ctx.fillRect(0, 0, W, H);
    softGlow(ctx, W * .5, H * .40, W * .46, 'rgba(255,255,255,ALPHA)', .5);
    ctx.fillStyle = 'rgba(20,58,78,.5)'; ctx.fillRect(0, H * .5, W, H * .012);
    for (let i = 0; i < 60; i++) { // лёд снаружи
      const t = Math.pow(r(), .6), y = H * (.52 + t * .45);
      ctx.globalAlpha = (1 - t) * .28; ctx.fillStyle = '#E3F4FB';
      ctx.fillRect(r() * W, y, W * (.02 + r() * .12), Math.max(1, H * .004));
    }
    ctx.globalAlpha = 1;
    // кромка входа
    const N = 44, arc = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      arc.push([W * (.05 + t * .9) + (r() - .5) * W * .008,
                H * (1.03 - Math.pow(Math.sin(Math.PI * t), .5) * .9) + (r() - .5) * H * .02]);
    }
    ctx.beginPath(); ctx.rect(0, 0, W, H);
    ctx.moveTo(arc[0][0], arc[0][1]); arc.forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath();
    ctx.fillStyle = grad(ctx, 0, 0, 0, H, [[0, '#06111A'], [.45, '#0C2836'], [1, '#040A10']]);
    ctx.fill('evenodd');
    ctx.beginPath(); ctx.moveTo(arc[0][0], arc[0][1]); arc.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.strokeStyle = 'rgba(169,229,245,.55)'; ctx.lineWidth = Math.max(1.4, W * .003); ctx.stroke();
    arc.forEach((p, i) => { // сосульки
      if (i % 2 || p[1] > H * .9) return;
      const len = H * (.02 + r() * .11) * (1 - Math.abs(i / N - .5) * .7), w = W * (.0035 + r() * .004);
      ctx.beginPath(); ctx.moveTo(p[0] - w, p[1] - H * .004); ctx.lineTo(p[0] + w, p[1] - H * .004);
      ctx.lineTo(p[0], p[1] + len); ctx.closePath();
      ctx.fillStyle = 'rgba(190,232,246,' + (.35 + r() * .45) + ')'; ctx.fill();
    });
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 80; i++) { // блики на стенах
      const side = r() > .5, x = side ? r() * W * .16 : W - r() * W * .16, y = r() * H;
      ctx.globalAlpha = .04 + r() * .15; ctx.fillStyle = '#A9E5F5';
      ctx.fillRect(x, y, W * (.01 + r() * .07), Math.max(1, H * .003));
    }
    ctx.restore();
    finish(ctx, W, H, .5);
  },

  /* Ольхон на закате */
  olkhon(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .6;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0C1B28'], [.3, '#1E3E52'], [.6, '#68637A'], [.82, '#C98E63'], [1, '#F0C289']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .3, hz - H * .05, W * .42, 'rgba(255,196,128,ALPHA)', .55);
    ctx.beginPath(); ctx.arc(W * .3, hz - H * .045, Math.min(W, H) * .045, 0, 7); ctx.fillStyle = '#FFDCA8'; ctx.fill();
    // острова
    ([[.575, .022, 'rgba(28,58,74,.9)'], [.592, .03, 'rgba(18,42,56,.95)']] as [number, number, string][]).forEach((L, i) => {
      ctx.fillStyle = L[2]; ridgePath(ctx, W, hz + 2, H * L[0], H * L[1], .7, r, i ? -1 : 1); ctx.fill();
    });
    waterBody(ctx, W, H, hz, '#204A5E', '#0A141C', W * .3, 'rgba(255,205,150,.8)', r, .8);
    // степной берег — песчаные холмы
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += W / 90) {
      const t = x / W;
      ctx.lineTo(x, H * (.84 - Math.sin(t * 1.7 * Math.PI + 1.1) * .06 - Math.sin(t * 5.2 * Math.PI) * .015));
    }
    ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = grad(ctx, 0, H * .74, 0, H, [[0, '#7A6748'], [.5, '#3C3527'], [1, '#14140F']]); ctx.fill();
    ctx.save(); ctx.globalAlpha = .5;
    for (let i = 0; i < 160; i++) { // трава
      const x = r() * W, y = H * (.86 + r() * .13), h = H * (.008 + r() * .02);
      ctx.strokeStyle = 'rgba(197,167,123,' + (.15 + r() * .4) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - .5) * W * .01, y - h); ctx.stroke();
    }
    ctx.restore();
    finish(ctx, W, H, .55);
  },

  /* Мыс Хобой — скалы и Малое море */
  khoboy(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .52;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0A1824'], [.45, '#1C4A61'], [.8, '#5896AF'], [1, '#A7CFDD']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .78, hz - H * .12, W * .34, 'rgba(226,240,248,ALPHA)', .35);
    // дальние мысы — воздушная перспектива
    for (let i = 0; i < 4; i++) {
      const y = hz - H * (.02 + i * .012), a = .18 + i * .2;
      ctx.fillStyle = 'rgba(16,48,64,' + a + ')';
      ridgePath(ctx, W, hz + 2, y, H * (.02 + i * .006), 1.1, r, i % 2 ? -1 : 1); ctx.fill();
    }
    waterBody(ctx, W, H, hz, '#16465C', '#060E15', null, null, r, .9);
    // главная скала слева
    ctx.beginPath();
    ctx.moveTo(0, H); ctx.lineTo(0, H * .2);
    ctx.lineTo(W * .09, H * .26); ctx.lineTo(W * .14, H * .17); ctx.lineTo(W * .21, H * .33);
    ctx.lineTo(W * .27, H * .29); ctx.lineTo(W * .33, H * .46); ctx.lineTo(W * .38, H * .58);
    ctx.lineTo(W * .3, H * .78); ctx.lineTo(W * .12, H); ctx.closePath();
    ctx.fillStyle = grad(ctx, 0, H * .2, W * .38, H, [[0, '#2A4A5C'], [.45, '#14303F'], [1, '#070F16']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.globalAlpha = .5;
    for (let i = 0; i < 40; i++) { // сколы породы
      const x = r() * W * .4, y = H * (.2 + r() * .8);
      ctx.strokeStyle = 'rgba(150,190,210,' + (.05 + r() * .18) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + W * .06 * (r() - .3), y + H * .1 * r()); ctx.stroke();
    }
    ctx.restore();
    // правый выступ
    ctx.beginPath(); ctx.moveTo(W, H); ctx.lineTo(W, H * .44);
    ctx.lineTo(W * .88, H * .5); ctx.lineTo(W * .8, H * .64); ctx.lineTo(W * .86, H); ctx.closePath();
    ctx.fillStyle = 'rgba(9,22,31,.95)'; ctx.fill();
    ctx.save(); ctx.globalAlpha = .6; // чайки
    for (let i = 0; i < 7; i++) {
      const x = W * (.45 + r() * .4), y = H * (.14 + r() * .22), s = W * (.004 + r() * .006);
      ctx.strokeStyle = '#D8E9F1'; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.moveTo(x - s, y); ctx.quadraticCurveTo(x, y - s * .8, x + s, y); ctx.stroke();
    }
    ctx.restore();
    finish(ctx, W, H, .55);
  },

  /* Тажеранские степи — джип и пыль */
  steppe(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .46;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0E2233'], [.4, '#27566E'], [.75, '#7FA8B6'], [1, '#D7C9A8']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .62, hz - H * .16, W * .3, 'rgba(255,236,200,ALPHA)', .4);
    ctx.fillStyle = 'rgba(22,58,76,.75)'; ridgePath(ctx, W, hz + 2, hz - H * .03, H * .022, .8, r, 1); ctx.fill();
    ctx.fillStyle = 'rgba(88,140,160,.5)'; ctx.fillRect(0, hz - H * .012, W, H * .014); // полоска Малого моря
    // степь
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += W / 120) {
      const t = x / W;
      ctx.lineTo(x, hz + H * (.02 + Math.sin(t * 2.3 * Math.PI + .6) * .035 + Math.sin(t * 6.1 * Math.PI) * .012));
    }
    ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = grad(ctx, 0, hz, 0, H, [[0, '#C5A77B'], [.35, '#8C7550'], [.75, '#493D2A'], [1, '#1B1810']]); ctx.fill();
    ctx.save(); ctx.globalAlpha = .35;
    for (let i = 0; i < 220; i++) {
      const y = hz + H * (.03 + Math.pow(r(), .8) * .6), x = r() * W;
      ctx.fillStyle = 'rgba(226,205,168,' + (.1 + r() * .4) + ')';
      ctx.fillRect(x, y, W * .004 * (1 + r()), 1);
    }
    ctx.restore();
    // колея
    ctx.save(); ctx.globalAlpha = .3; ctx.strokeStyle = '#E2CDA8'; ctx.lineWidth = Math.max(1, W * .003);
    ([[.44, .1], [.48, .16]] as [number, number][]).forEach(o => {
      ctx.beginPath(); ctx.moveTo(W * (.5 + o[1] * .2), hz + H * .045);
      ctx.quadraticCurveTo(W * (.4 + o[0] * .2), H * .8, W * (o[0] - .2), H); ctx.stroke();
    });
    ctx.restore();
    // джип
    const jx = W * .53, jy = hz + H * .085, jw = Math.max(26, W * .062), jh = jw * .42;
    ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = '#E4D3B4'; // пыль
    for (let i = 0; i < 16; i++) { const t = i / 16; softGlow(ctx, jx + jw * (.8 + t * 3.2), jy + jh * .3, jw * (.35 + t * .9), 'rgba(226,209,178,ALPHA)', .22 * (1 - t)); }
    ctx.restore();
    ctx.fillStyle = '#0D1620';
    ctx.fillRect(jx, jy - jh * .55, jw, jh * .55);                     // кузов
    ctx.fillRect(jx + jw * .18, jy - jh * .95, jw * .62, jh * .42);    // кабина
    ctx.fillRect(jx + jw * .16, jy - jh * 1.06, jw * .66, jh * .07);   // багажник на крыше
    ctx.beginPath(); ctx.arc(jx + jw * .22, jy, jh * .24, 0, 7); ctx.arc(jx + jw * .8, jy, jh * .24, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,238,205,.85)'; ctx.fillRect(jx - jw * .04, jy - jh * .42, jw * .06, jh * .12);
    finish(ctx, W, H, .5);
  },

  /* Иркутск вечером */
  irkutsk(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .68;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#08121C'], [.35, '#14293C'], [.7, '#3A4E5E'], [.92, '#8E7B6B'], [1, '#C79A72']]);
    ctx.fillRect(0, 0, W, hz);
    stars(ctx, W, H * .3, H * .3, r, 120);
    softGlow(ctx, W * .2, hz - H * .04, W * .4, 'rgba(240,180,120,ALPHA)', .35);
    const base = hz - H * .01;
    const b = [];
    let x = 0; while (x < W) { const w = W * (.03 + r() * .06); b.push([x, w, H * (.06 + r() * .13)]); x += w + W * .004; }
    b.forEach(([bx, bw, bh], i) => {
      ctx.fillStyle = i % 3 === 0 ? '#0B1620' : '#0E1D28';
      ctx.fillRect(bx, base - bh, bw, bh);
      for (let wy = base - bh + H * .012; wy < base - H * .01; wy += H * .022)
        for (let wx = bx + bw * .12; wx < bx + bw * .88; wx += bw * .22)
          if (r() > .45) { ctx.fillStyle = r() > .75 ? 'rgba(255,214,150,.9)' : 'rgba(255,190,120,.55)'; ctx.fillRect(wx, wy, Math.max(1.2, bw * .1), Math.max(1.2, H * .008)); }
    });
    // купола храма
    const cx = W * .74, cb = base, ch = H * .2;
    ctx.fillStyle = '#0A141D'; ctx.fillRect(cx - W * .045, cb - ch * .6, W * .09, ch * .6);
    ([[0, .055], [-.05, .038], [.05, .038]] as [number, number][]).forEach(d => {
      const dx = cx + W * d[0], dh = ch * (d[1] * 8);
      ctx.fillStyle = '#0A141D'; ctx.fillRect(dx - W * .011, cb - ch * .6 - dh * .5, W * .022, dh * .5);
      ctx.beginPath(); ctx.moveTo(dx - W * .018, cb - ch * .6 - dh * .45);
      ctx.bezierCurveTo(dx - W * .022, cb - ch * .6 - dh * 1.1, dx + W * .022, cb - ch * .6 - dh * 1.1, dx + W * .018, cb - ch * .6 - dh * .45);
      ctx.closePath(); ctx.fillStyle = '#16232E'; ctx.fill();
      ctx.strokeStyle = 'rgba(197,167,123,.7)'; ctx.lineWidth = 1; ctx.stroke();
    });
    // Ангара
    ctx.fillStyle = grad(ctx, 0, hz, 0, H, [[0, '#1B3A4B'], [1, '#070E14']]); ctx.fillRect(0, hz, W, H - hz);
    ctx.save();
    for (let i = 0; i < 70; i++) {
      const t = Math.pow(r(), .7), y = hz + t * (H - hz);
      ctx.globalAlpha = (1 - t) * .35; ctx.fillStyle = r() > .5 ? '#FFC98A' : '#A9E5F5';
      ctx.fillRect(r() * W, y, W * (.01 + r() * .05), Math.max(1, (H - hz) * .008));
    }
    ctx.restore();
    // набережная
    ctx.fillStyle = 'rgba(6,11,16,.9)'; ctx.fillRect(0, hz - H * .008, W, H * .012);
    for (let i = 0; i < 12; i++) { const lx = (i + .5) * W / 12; softGlow(ctx, lx, hz - H * .02, W * .03, 'rgba(255,200,140,ALPHA)', .45); }
    finish(ctx, W, H, .55);
  },

  /* Ночь: Млечный Путь над озером */
  night(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .58;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#03060B'], [.5, '#071522'], [1, '#0E2E42']]);
    ctx.fillRect(0, 0, W, hz);
    ctx.save(); ctx.translate(W * .5, H * .2); ctx.rotate(-.4); // Млечный Путь
    for (let i = 0; i < 420; i++) {
      const x = (r() - .5) * W * 1.6, y = (r() - .5) * H * .3 * (1 - Math.abs(x) / (W * 1.1));
      ctx.globalAlpha = .05 + r() * .45; ctx.fillStyle = r() > .8 ? '#A9E5F5' : '#FFFFFF';
      ctx.fillRect(x, y, r() > .95 ? 1.8 : 1, r() > .95 ? 1.8 : 1);
    }
    ctx.globalAlpha = .1; softGlow(ctx, 0, 0, W * .5, 'rgba(150,190,230,ALPHA)', .5);
    ctx.restore();
    stars(ctx, W, hz, hz, r, 260);
    ctx.fillStyle = '#050C12'; ridgePath(ctx, W, hz + 2, hz - H * .02, H * .03, 1, r, 1); ctx.fill();
    waterBody(ctx, W, H, hz, '#0B2333', '#03070B', null, null, r, .5);
    ctx.save(); ctx.globalAlpha = .3;
    for (let i = 0; i < 90; i++) { ctx.fillStyle = '#9FD8EA'; ctx.fillRect(r() * W, hz + Math.pow(r(), .5) * (H - hz), 1, 1); }
    ctx.restore();
    finish(ctx, W, H, .5);
  },

  /* Люди на хребте против света */
  people(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .66;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0B1A26'], [.4, '#1E4B62'], [.75, '#8AB4C2'], [1, '#E8C79B']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .58, hz - H * .06, W * .4, 'rgba(255,214,160,ALPHA)', .55);
    ctx.fillStyle = 'rgba(20,52,68,.7)'; ridgePath(ctx, W, hz, hz - H * .06, H * .03, .9, r, -1); ctx.fill();
    waterBody(ctx, W, H, hz, '#1A4459', '#08111A', W * .58, 'rgba(255,210,160,.7)', r, .7);
    // передний хребет с фигурами
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += W / 80) { const t = x / W; ctx.lineTo(x, H * (.8 - Math.sin(t * 1.5 * Math.PI + .3) * .07)); }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = '#050B11'; ctx.fill();
    const fy = (t: number) => H * (.8 - Math.sin(t * 1.5 * Math.PI + .3) * .07);
    ([[.36, 1], [.44, .92], [.5, .86]] as [number, number][]).forEach(([t, s]) => {
      const x = W * t, y = fy(t), hh = H * .09 * s, ww = hh * .17;
      ctx.fillStyle = '#04080D';
      ctx.beginPath(); ctx.arc(x, y - hh, ww * .85, 0, 7); ctx.fill();
      ctx.fillRect(x - ww, y - hh + ww * .6, ww * 2, hh * .62);
      ctx.fillRect(x - ww * .7, y - hh * .3, ww * .6, hh * .32);
      ctx.fillRect(x + ww * .1, y - hh * .3, ww * .6, hh * .32);
    });
    finish(ctx, W, H, .5);
  },

  /* Тайга и тихая вода — Листвянка */
  taiga(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .55;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0A1722'], [.4, '#1A4258'], [.78, '#6FA0B4'], [1, '#BBD9E3']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .42, hz - H * .18, W * .3, 'rgba(235,245,250,ALPHA)', .3);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = 'rgba(19,50,66,' + (.35 + i * .22) + ')';
      ridgePath(ctx, W, hz + 2, hz - H * (.05 - i * .014), H * (.035 - i * .008), .9, r, i % 2 ? -1 : 1); ctx.fill();
    }
    // хвойный лес по кромке
    ctx.fillStyle = '#08161E';
    for (let i = 0; i < 140; i++) {
      const x = r() * W, base = hz - H * .002, hh = H * (.02 + r() * .045), ww = hh * .3;
      ctx.beginPath(); ctx.moveTo(x, base - hh); ctx.lineTo(x + ww, base); ctx.lineTo(x - ww, base); ctx.closePath(); ctx.fill();
    }
    waterBody(ctx, W, H, hz, '#17475E', '#050C12', W * .42, 'rgba(220,238,246,.6)', r, .8);
    ctx.save(); ctx.globalAlpha = .25; ctx.scale(1, -1); // отражение леса
    ctx.translate(0, -2 * hz);
    ctx.fillStyle = '#0B1F2A';
    for (let i = 0; i < 60; i++) { const x = r() * W, base = hz - H * .002, hh = H * (.02 + r() * .04), ww = hh * .3;
      ctx.beginPath(); ctx.moveTo(x, base - hh); ctx.lineTo(x + ww, base); ctx.lineTo(x - ww, base); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // туман
    for (let i = 0; i < 4; i++) { const y = hz + (H - hz) * (.05 + i * .1);
      haze(ctx, W, H, y, y - H * .05, 'rgba(190,220,232,ALPHA)', .14); }
    finish(ctx, W, H, .5);
  },

  /* Шаман-скала / сакральный Байкал */
  shaman(ctx: Ctx, W: number, H: number, r: R) {
    const hz = H * .6;
    ctx.fillStyle = grad(ctx, 0, 0, 0, hz, [[0, '#0A131D'], [.35, '#1B3E55'], [.7, '#5E7E8F'], [.9, '#C9906A'], [1, '#EFC08B']]);
    ctx.fillRect(0, 0, W, hz);
    softGlow(ctx, W * .74, hz - H * .08, W * .36, 'rgba(255,190,130,ALPHA)', .5);
    ctx.fillStyle = 'rgba(17,44,58,.85)'; ridgePath(ctx, W, hz + 2, hz - H * .035, H * .025, .8, r, 1); ctx.fill();
    waterBody(ctx, W, H, hz, '#1A4256', '#070E15', W * .74, 'rgba(255,200,150,.75)', r, .85);
    // Шаман-скала: двугорбый мыс Бурхан
    const rock: [number, number][] = [[.13,1],[.15,.82],[.185,.70],[.22,.61],[.245,.51],[.272,.455],[.30,.50],[.325,.60],[.35,.56],[.375,.47],[.40,.435],[.425,.51],[.45,.66],[.472,.80],[.50,1]];
    ctx.beginPath(); ctx.moveTo(W * rock[0][0], H * rock[0][1]);
    rock.forEach(p => ctx.lineTo(W * p[0], H * p[1])); ctx.closePath();
    ctx.fillStyle = grad(ctx, W * .13, H * .43, W * .5, H, [[0, '#3C5E70'], [.35, '#1B3846'], [1, '#060D14']]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.globalAlpha = .5;
    for (let i = 0; i < 42; i++) {
      const x = W * (.13 + r() * .37), y = H * (.43 + r() * .57);
      ctx.strokeStyle = 'rgba(150,196,216,' + (.05 + r() * .16) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + W * .03 * (r() - .3), y + H * .09 * r()); ctx.stroke();
    }
    ctx.restore();
    // сэргэ с лентами на ветру
    const sx = W * .68, sy = H * .84, ph = H * .19;
    ctx.strokeStyle = '#0A131B'; ctx.lineWidth = Math.max(2, W * .006);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - ph); ctx.stroke();
    ['rgba(169,229,245,.8)', 'rgba(197,167,123,.75)', 'rgba(245,247,248,.6)', 'rgba(127,184,204,.7)'].forEach((c, i) => {
      const y0 = sy - ph * (.94 - i * .13);
      ctx.strokeStyle = c; ctx.lineWidth = Math.max(1.2, W * .0028);
      ctx.beginPath(); ctx.moveTo(sx, y0);
      ctx.bezierCurveTo(sx + W * .05, y0 - H * .025, sx + W * .105, y0 + H * .03, sx + W * (.16 + i * .012), y0 + H * (.012 + i * .008));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    finish(ctx, W, H, .55);
  }
};


export const SEEDS: Record<string, number> = { dawn: 11, ice: 23, grotto: 5, olkhon: 42, khoboy: 17, steppe: 8, irkutsk: 31, night: 64, people: 12, taiga: 3, shaman: 27 };

export function paintScene(cv: HTMLCanvasElement, key: string, seed?: number) {
  const fn = SCENES[key] || SCENES.dawn;
  const w = Math.max(1, Math.round((cv.clientWidth || 800) * DPR));
  const h = Math.max(1, Math.round((cv.clientHeight || 600) * DPR));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  fn(ctx, w, h, rng((seed ?? SEEDS[key] ?? 9) * 7919));
  cv.dataset.painted = '1';
}
