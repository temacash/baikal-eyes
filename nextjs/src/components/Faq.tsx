import type { Faq as FaqItem } from '@/lib/data';

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>{f.q}</summary>
          <div className="ans">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
