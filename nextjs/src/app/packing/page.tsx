import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Scene from '@/components/Scene';
import Reveal from '@/components/Reveal';
import SeasonPacking from '@/components/SeasonPacking';
import { PACKING } from '@/lib/packing';
import { tgLink } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Что взять с собой на Байкал',
  description: 'Памятка Baikal Eyes: что брать на Байкал зимой, летом и в межсезонье — одежда, обувь, документы, техника. И что мы возим сами.'
};

export default function PackingPage() {
  return (
    <>
      <section className="section wrap" style={{ paddingTop: 'clamp(120px,15vw,190px)' }}>
        <div className="shead">
          <div>
            <p className="label">Памятка путешественнику</p>
            <Reveal><h2>Что взять с собой на Байкал</h2></Reveal>
            <p className="switchline">Не уверены, что подойдёт для ваших дат? <Link href="/contacts">Спросите нас →</Link></p>
          </div>
          <p className="lead" style={{ maxWidth: '40ch' }}>
            Короткий список, собранный за девять лет выездов. Всё, что можно не брать, мы возим сами — об этом ниже.
          </p>
        </div>
        <SeasonPacking />
      </section>

      <section className="section section--tight wrap">
        <div className="shead"><div><p className="label">В любой сезон</p><Reveal><h2>Всегда с собой</h2></Reveal></div></div>
        <div className="packgrid packgrid--4">
          {PACKING.always.map((c) => (
            <div className="packcol" key={c.h}>
              <h3>{c.h}</h3>
              <ul className="checks one">
                {c.items.map((t) => <li key={t}><Check size={16} /><span>{t}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="story">
          <figure className="storyimg"><Scene scene="ice" seed={23} label="Лёд Байкала" /><figcaption>Малое море, февраль</figcaption></figure>
          <div>
            <p className="label" style={{ marginBottom: 18 }}>Это брать не нужно</p>
            <Reveal><h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 22 }}>Мы возим сами</h2></Reveal>
            <ul className="checks one">
              {PACKING.weGive.map((t) => <li key={t}><Check size={16} /><span>{t}</span></li>)}
            </ul>
            <p className="lead" style={{ marginTop: 22 }}>
              Если чего-то не хватает — скажите заранее: подберём тёплые вещи и обувь в Иркутске перед выездом.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="shead"><div><p className="label">Из опыта</p><Reveal><h2>Пять вещей, о которых забывают</h2></Reveal></div></div>
        <ul className="timeline">
          {PACKING.tips.map((t, i) => (
            <li key={t[0]}><em>0{i + 1}</em><strong>{t[0]}</strong><p>{t[1]}</p></li>
          ))}
        </ul>
      </section>

      <section className="section section--tight wrap">
        <div className="cta-band">
          <h2>Соберём маршрут — <b>подскажем сборы</b></h2>
          <p className="lead" style={{ margin: '20px auto 0', maxWidth: '46ch' }}>
            Напишите даты поездки: пришлём список вещей под погоду именно этих дней.
          </p>
          <div className="btnrow">
            <a className="btn" href={tgLink('Здравствуйте! Подскажите, что взять с собой на Байкал.')} target="_blank" rel="noopener">
              Спросить в Telegram <ArrowRight size={15} />
            </a>
            <Link className="btn btn--ghost" href="/excursions">Выбрать маршрут</Link>
          </div>
        </div>
      </section>
    </>
  );
}
