import type { Tour } from '@/lib/data';

export default function RouteMap({ tour }: { tour: Tour }) {
  const pts = tour.route.filter((p) => p[1] !== null) as [string, number][];
  const W = 1000, H = 210, pad = 60;
  const max = pts.length ? pts[pts.length - 1][1] || 1 : 1;
  const nodes = pts.map((p, i) => ({
    x: pad + (W - pad * 2) * (max ? p[1] / max : i / Math.max(1, pts.length - 1)),
    y: H * 0.55 + Math.sin(i * 1.5) * 26,
    n: p[0], km: p[1]
  }));
  let d = nodes.length ? `M${nodes[0].x} ${nodes[0].y}` : '';
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1], b = nodes[i], mx = (a.x + b.x) / 2;
    d += ` C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }

  return (
    <div className="mapbox">
      {nodes.length > 1 && (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Схема маршрута">
          <defs>
            <linearGradient id="rg" x1="0" x2="1">
              <stop offset="0" stopColor="#123B50" /><stop offset="1" stopColor="#A9E5F5" />
            </linearGradient>
          </defs>
          <path d={d} fill="none" stroke="url(#rg)" strokeWidth="2" strokeDasharray="6 7" opacity=".9" />
          {nodes.map((n, i) => (
            <g key={n.n}>
              <circle cx={n.x} cy={n.y} r={i === 0 || i === nodes.length - 1 ? 7 : 4.5} fill="#0B1117" stroke="#A9E5F5" strokeWidth="1.6" />
              <text x={n.x} y={n.y - 18} textAnchor="middle" fill="#F5F7F8" fontSize="15">{n.n}</text>
              <text x={n.x} y={n.y + 26} textAnchor="middle" fill="#6FB8CF" fontSize="12">{n.km} км</text>
            </g>
          ))}
        </svg>
      )}
      <div className="mlegend">
        {tour.route.map((p) => <span key={p[0]}><b>{p[1] === null ? '—' : `${p[1]} км`}</b>{p[0]}</span>)}
      </div>
    </div>
  );
}
