import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { tgLink } from '@/lib/contacts';

export default function CtaBand({ note }: { note?: string }) {
  const msg = 'Здравствуйте! Хочу подобрать путешествие по Байкалу.';
  return (
    <div className="cta-band">
      {note && <p className="label label--plain" style={{ justifyContent: 'center', marginBottom: 18 }}>{note}</p>}
      <h2>Готовы увидеть Байкал <b>своими глазами?</b></h2>
      <p className="lead" style={{ margin: '20px auto 0', maxWidth: '46ch' }}>
        Напишите нам — вместе соберём маршрут под ваши даты, компанию и погоду.
      </p>
      <div className="btnrow">
        <a className="btn" href={tgLink(msg)} target="_blank" rel="noopener">Связаться с нами <ArrowRight size={15} /></a>
        <Link className="btn btn--ghost" href="/contacts">Все контакты</Link>
      </div>
    </div>
  );
}
