'use client';

import { useMemo, useState } from 'react';

export type Point = { d: string; visits: number; visitors: number };

const C_VIEWS = '#29A1C1';   // визиты
const C_UNIQ = '#AD7C2F';    // уникальные посетители

const W = 1000, H = 300, PL = 46, PR = 18, PT = 18, PB = 30;

const fmtDay = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

function niceMax(v: number) {
  if (v <= 4) return 4;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (mag / 2)) * (mag / 2);
}

export default function TrendChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const { max, xs, pathViews, pathUniq, areaViews, ticks } = useMemo(() => {
    const max = niceMax(Math.max(1, ...data.map((p) => Math.max(p.visits, p.visitors))));
    const iw = W - PL - PR, ih = H - PT - PB;
    const x = (i: number) => PL + (data.length < 2 ? iw / 2 : (i * iw) / (data.length - 1));
    const y = (v: number) => PT + ih - (v / max) * ih;
    const xs = data.map((_, i) => x(i));
    const line = (key: 'visits' | 'visitors') =>
      data.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
    const pv = line('visits');
    const area = data.length
      ? `${pv} L${x(data.length - 1).toFixed(1)},${(PT + ih).toFixed(1)} L${x(0).toFixed(1)},${(PT + ih).toFixed(1)} Z`
      : '';
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: Math.round(max * f), y: y(max * f) }));
    return { max, xs, pathViews: pv, pathUniq: line('visitors'), areaViews: area, ticks };
  }, [data]);

  const ih = H - PT - PB;
  const yOf = (v: number) => PT + ih - (v / max) * ih;
  const act = hover != null ? data[hover] : null;
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <section className="acard acard--wide">
      <header className="acard__head">
        <div>
          <h2>Визиты по дням</h2>
          <p className="amuted">Просмотры страниц и уникальные посетители</p>
        </div>
        <div className="alegend">
          <span><i style={{ background: C_VIEWS }} />Просмотры</span>
          <span><i style={{ background: C_UNIQ }} />Посетители</span>
          <button className="alink" onClick={() => setTable((t) => !t)}>
            {table ? 'График' : 'Таблица'}
          </button>
        </div>
      </header>

      {table ? (
        <div className="atable-wrap" style={{ maxHeight: 320 }}>
          <table className="atable">
            <thead><tr><th>Дата</th><th>Просмотры</th><th>Посетители</th></tr></thead>
            <tbody>
              {[...data].reverse().map((p) => (
                <tr key={p.d}><td>{fmtDay(p.d)}</td><td>{p.visits}</td><td>{p.visitors}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="achart">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="График визитов по дням" className="achart__svg">
            {ticks.map((t) => (
              <g key={t.v + '-' + t.y}>
                <line x1={PL} x2={W - PR} y1={t.y} y2={t.y} className="agridline" />
                <text x={PL - 10} y={t.y + 4} className="aaxis" textAnchor="end">{t.v}</text>
              </g>
            ))}

            {data.map((p, i) => {
              const last = i === data.length - 1;
              const show = last || (i % labelEvery === 0 && data.length - 1 - i >= labelEvery * 0.6);
              return show ? (
                <text key={p.d} x={xs[i]} y={H - 8} className="aaxis"
                  textAnchor={last ? 'end' : i === 0 ? 'start' : 'middle'}>{fmtDay(p.d)}</text>
              ) : null;
            })}

            {areaViews && <path d={areaViews} fill={C_VIEWS} opacity={0.12} />}
            <path d={pathUniq} fill="none" stroke={C_UNIQ} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={pathViews} fill="none" stroke={C_VIEWS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

            {data.length > 0 && (
              <>
                <circle cx={xs[data.length - 1]} cy={yOf(data[data.length - 1].visits)} r={4.5} fill={C_VIEWS} stroke="#0E151D" strokeWidth={2} />
                <circle cx={xs[data.length - 1]} cy={yOf(data[data.length - 1].visitors)} r={4.5} fill={C_UNIQ} stroke="#0E151D" strokeWidth={2} />
              </>
            )}

            {act && hover != null && (
              <>
                <line x1={xs[hover]} x2={xs[hover]} y1={PT} y2={PT + ih} className="across" />
                <circle cx={xs[hover]} cy={yOf(act.visits)} r={5} fill={C_VIEWS} stroke="#0E151D" strokeWidth={2} />
                <circle cx={xs[hover]} cy={yOf(act.visitors)} r={5} fill={C_UNIQ} stroke="#0E151D" strokeWidth={2} />
              </>
            )}

            <rect
              x={PL} y={PT} width={W - PL - PR} height={ih} fill="transparent"
              onMouseLeave={() => setHover(null)}
              onMouseMove={(e) => {
                const box = (e.target as SVGRectElement).getBoundingClientRect();
                const rel = (e.clientX - box.left) / box.width;
                setHover(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))));
              }}
            />
          </svg>

          {act && hover != null && (
            <div
              className="atip"
              style={{
                left: `${((xs[hover] - PL) / (W - PL - PR)) * 100}%`,
                transform: `translateX(${hover > data.length / 2 ? '-105%' : '5%'})`,
              }}
            >
              <b>{fmtDay(act.d)}</b>
              <span><i style={{ background: C_VIEWS }} />Просмотры<em>{act.visits}</em></span>
              <span><i style={{ background: C_UNIQ }} />Посетители<em>{act.visitors}</em></span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
