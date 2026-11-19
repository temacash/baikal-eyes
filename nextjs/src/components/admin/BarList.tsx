'use client';

export type Row = { label: string; value: number };

/** Горизонтальные полосы: одна величина — один цвет, длина и есть значение. */
export default function BarList({
  title, note, rows, unit = '',
}: { title: string; note?: string; rows: Row[]; unit?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0);

  return (
    <section className="acard">
      <header className="acard__head">
        <div>
          <h2>{title}</h2>
          {note && <p className="amuted">{note}</p>}
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="aempty">Пока нет данных за этот период.</p>
      ) : (
        <ul className="abars">
          {rows.map((r) => (
            <li key={r.label} title={`${r.label}: ${r.value}${unit}`}>
              <span className="abars__label">{r.label}</span>
              <span className="abars__track">
                <span className="abars__fill" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
              </span>
              <span className="abars__val">
                {r.value}
                {total > 0 && <em>{Math.round((r.value / total) * 100)}%</em>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
