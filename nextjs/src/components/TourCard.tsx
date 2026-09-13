import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Scene from './Scene';
import { money } from '@/lib/contacts';
import { kindOf, type Tour } from '@/lib/data';

export default function TourCard({ t }: { t: Tour }) {
  return (
    <Link className="card" href={`/${kindOf(t) === 'excursion' ? 'excursions' : 'tours'}/${t.slug}`} aria-label={t.title}>
      <div className="card__media">
        <Scene scene={t.scene} seed={t.seed} label={t.title} />
        <span className="card__tag">{t.kicker}</span>
        <div className="card__price">
          <b>{t.price ? `${money(t.price)} ₽` : 'по запросу'}</b>
          <span>{t.price ? 'с человека' : ''}</span>
        </div>
      </div>
      <div className="card__body">
        <h3>{t.title}</h3>
        <p>{t.short}</p>
        <div className="card__hidden"><ul>{t.see.slice(0, 3).map((s) => <li key={s}>{s}</li>)}</ul></div>
        <div className="card__meta">
          <span>{t.durShort} · {t.type}</span>
          <span className="go">Подробнее <ArrowRight size={13} /></span>
        </div>
      </div>
    </Link>
  );
}
