import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Minus, Phone, Send } from 'lucide-react';
// Общая страница маршрута: используется и для экскурсий, и для туров.
import Scene from '@/components/Scene';
import Reveal from '@/components/Reveal';
import Gallery from '@/components/Gallery';
import RouteMap from '@/components/RouteMap';
import Faq from '@/components/Faq';
import BookingForm from '@/components/BookingForm';
import { bySlug, kindOf } from '@/lib/data';
import { CONTACTS, money, tgLink } from '@/lib/contacts';

export default function RoutePage({ slug }: { slug: string }) {
  const t = bySlug(slug);
  if (!t) notFound();
  const isExc = kindOf(t) === 'excursion';
  const price = t.price ? `${money(t.price)} ₽` : t.priceNote || 'по запросу';
  const msg = `Здравствуйте! Интересует маршрут «${t.title}».`;

  return (
    <>
      <section className="thero">
        <div className="thero__bg"><Scene scene={t.scene} seed={t.seed} eager label={t.title} /></div>
        <div className="thero__in">
          <Link className="crumb" href={isExc ? '/excursions' : '/tours'}>← {isExc ? 'Все экскурсии' : 'Все туры'}</Link>
          <p className="label" style={{ marginTop: 22 }}>{t.kicker}</p>
          <h1>{t.title}</h1>
          <p className="lead" style={{ maxWidth: '52ch', marginBottom: 34 }}>{t.intro}</p>
          <div className="facts">
            <div className="fact"><span>Длительность</span><b>{t.dur}</b></div>
            <div className="fact"><span>Формат</span><b>{t.type}</b></div>
            <div className="fact"><span>Группа</span><b>{t.group}</b></div>
            <div className="fact"><span>Стоимость</span><b>{price}</b></div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="tlayout">
          <div>
            <Reveal className="tblock"><h2>О путешествии</h2>{t.body.map((p) => <p className="lead" key={p.slice(0, 24)}>{p}</p>)}</Reveal>

            <Reveal className="tblock">
              <h2>Что вы увидите</h2>
              <ul className="checks">{t.see.map((s) => <li key={s}><Check size={16} /><span>{s}</span></li>)}</ul>
            </Reveal>

            <Reveal className="tblock">
              <h2>Программа</h2>
              <ul className="timeline">
                {t.program.map((p) => <li key={p.t + p.h}><em>{p.t}</em><strong>{p.h}</strong><p>{p.p}</p></li>)}
              </ul>
            </Reveal>

            <Reveal className="tblock">
              <h2>Что входит</h2>
              <ul className="checks" style={{ marginBottom: 26 }}>{t.inc.map((s) => <li key={s}><Check size={16} /><span>{s}</span></li>)}</ul>
              <p className="label" style={{ marginBottom: 16 }}>Оплачивается отдельно</p>
              <ul className="checks no">{t.exc.map((s) => <li key={s}><Minus size={16} /><span className="muted">{s}</span></li>)}</ul>
            </Reveal>

            <Reveal className="tblock"><h2>Маршрут</h2><RouteMap tour={t} /></Reveal>

            <Reveal className="tblock">
              <h2>Галерея</h2>
              <Gallery scenes={t.gallery} title={t.title} />
              <p className="formnote" style={{ marginTop: 12 }}>
                Визуалы — процедурные сцены-заглушки. Замените их на реальные фотографии маршрута в компоненте Scene.
              </p>
            </Reveal>

            <Reveal className="tblock"><h2>Частые вопросы</h2><Faq items={t.faq} /></Reveal>

            <Reveal className="tblock">
              <h2>Отзывы</h2>
              <div className="quotes">
                {t.rev.map((r) => (
                  <figure className="quote" key={r.n + r.t.slice(0, 10)}>
                    <p>«{r.t}»</p>
                    <figcaption className="who"><span className="av">{r.n[0]}</span><span><b>{r.n}</b><span>{r.c}</span></span></figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>

          <aside>
            <div className="sticky">
              <div className="bookcard">
                <p className="label label--plain">Бронирование</p>
                <div className="price"><b>{price}</b><span>{t.price ? 'с человека' : ''}</span></div>
                <p className="formnote">{t.season} · выезд: {t.pickup}</p>
                <hr />
                <div className="mini"><span>Длительность</span><b>{t.dur}</b></div>
                <div className="mini"><span>Группа</span><b>{t.group}</b></div>
                <div className="mini"><span>Формат</span><b>{t.type}</b></div>
                <hr />
                <a className="btn btn--full" href="#book">Забронировать путешествие <ArrowRight size={15} /></a>
                <div className="contactline">
                  <a className="iconbtn" href={tgLink(msg)} target="_blank" rel="noopener"><Send size={15} /> Telegram</a>
                  <a className="iconbtn" href={`tel:+${CONTACTS.phoneRaw}`}><Phone size={15} /> Позвонить</a>
                </div>
              </div>
              <div className="bookcard" id="book" style={{ marginTop: 16 }}>
                <p className="label label--plain">Заявка</p>
                <h3 style={{ fontSize: '1.3rem', margin: '14px 0 18px' }}>«{t.title}»</h3>
                <BookingForm tourTitle={t.title} idPrefix="bf" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
