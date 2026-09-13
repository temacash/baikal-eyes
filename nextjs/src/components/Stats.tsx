'use client';
import { useEffect, useRef, useState } from 'react';

type Item = { n: number; suf?: string; label: string; dec?: number };

function Counter({ n, suf = '', dec = 0 }: { n: number; suf?: string; dec?: number }) {
  const ref = useRef<HTMLBRElement | HTMLElement | null>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1500;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        setV(n * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { rootMargin: '0px 0px -10%' });
    io.observe(el as Element);
    return () => io.disconnect();
  }, [n]);
  return (
    <b ref={ref as never}>
      {dec ? v.toFixed(dec) : Math.round(v).toLocaleString('ru-RU').replace(/,/g, ' ')}
      {suf ? <i>{suf}</i> : null}
    </b>
  );
}

export default function Stats({ items }: { items: Item[] }) {
  return (
    <div className="stats">
      {items.map((it) => (
        <div className="stat" key={it.label}>
          <Counter n={it.n} suf={it.suf} dec={it.dec} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
