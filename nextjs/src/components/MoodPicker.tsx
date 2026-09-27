'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MOODS, kindOf, moodPicks } from '@/lib/data';

export default function MoodPicker() {
  const [active, setActive] = useState(MOODS[0].k);
  const mood = MOODS.find((m) => m.k === active)!;

  return (
    <div className="mood">
      <div className="mood__list" role="tablist" aria-label="Настроение путешествия">
        {MOODS.map((m, i) => (
          <button key={m.k} role="tab" aria-selected={m.k === active}
            className={'mood__it' + (m.k === active ? ' on' : '')}
            onMouseEnter={() => setActive(m.k)} onFocus={() => setActive(m.k)} onClick={() => setActive(m.k)}>
            <em>0{i + 1}</em><strong>{m.n}</strong><span className="dot" />
          </button>
        ))}
      </div>
      <div className="mood__stage">
        {MOODS.map((m, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={m.k} src={m.img} alt={m.n} loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
            className={m.k === active ? 'on' : ''} />
        ))}
        <div className="mood__cap">
          <p>{mood.d}</p>
          <div className="picks">
            {moodPicks(mood).map((t) => {
              const seg = kindOf(t) === 'excursion' ? 'excursions' : 'tours';
              return <Link className="pick" key={t.slug} href={`/${seg}/${t.slug}`}>{t.title} →</Link>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
