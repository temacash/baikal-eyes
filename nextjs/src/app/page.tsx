import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import Stats from '@/components/Stats';
import MoodPicker from '@/components/MoodPicker';
import TourCard from '@/components/TourCard';
import CtaBand from '@/components/CtaBand';
import { bySlug } from '@/lib/data';

const DAY_TRIPS = ['irkutsk-derevo-i-kamen', 'listvyanka-krugobaikalka', 'ledyanye-groty'];
const MULTI_DAY = ['led-olkhona', 'olkhon-ostrov-sily', 'bolshoe-kolco-baikala', 'arshan-tunkinskaya-dolina'];

const QUOTES = [
  ['Марина', 'Москва', 'Мы были уверены, что видели лёд на фотографиях. На месте оказалось, что фотографии — это вообще другое.'],
  ['Павел', 'Владивосток', 'Гид знает не только точки, но и людей. Нас угощали чаем в доме, куда туристов не водят.'],
  ['Антон', 'Москва', 'Не ожидал, что степь может быть интереснее озера. Оказалось — может.']
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section wrap">
        <div className="manifesto">
          <div><p className="label">Кто мы</p></div>
          <div className="body">
            <Reveal><h2>Baikal Eyes — это не просто экскурсии. Это возможность увидеть Байкал <b>глазами тех, кто его действительно знает.</b></h2></Reveal>
            <Reveal delay={.05}><p className="lead">Мы живём в Иркутске и ездим на Байкал круглый год — не по расписанию туроператора, а потому что знаем, где сегодня чистый лёд, куда ушёл ветер и в какой бухте на закате не будет ни одной машины.</p></Reveal>
            <Reveal delay={.1}><p className="lead">Маленькие группы, свои водители, свои маршруты. Мы показываем озеро не как туристическую открытку, а как живое место, которое хочется почувствовать.</p></Reveal>
          </div>
        </div>
        <Stats items={[
          { n: 9, label: 'лет на маршрутах' },
          { n: 2400, suf: '+', label: 'путешественников' },
          { n: 1642, suf: 'м', label: 'глубина под вами' },
          { n: 6, label: 'человек в группе максимум' }
        ]} />
      </section>

      <section className="section section--tight wrap" id="pick">
        <div className="shead">
          <div><p className="label">Фишка Baikal Eyes</p><Reveal><h2>Выберите свой Байкал</h2></Reveal></div>
          <p className="lead" style={{ maxWidth: '42ch' }}>Шесть разных озёр в одном. Выберите настроение — покажем маршруты, которые ему отвечают.</p>
        </div>
        <MoodPicker />
      </section>

      <section className="section wrap">
        <div className="shead">
          <div><p className="label">Экскурсии на день</p><Reveal><h2>Выехать утром — вернуться вечером</h2></Reveal></div>
          <Link className="btn btn--ghost btn--sm" href="/excursions">Все экскурсии <ArrowRight size={14} /></Link>
        </div>
        <div className="grid">
          {DAY_TRIPS.map((s) => { const t = bySlug(s)!; return <TourCard key={s} t={t} />; })}
        </div>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="shead">
          <div><p className="label">Многодневные туры</p><Reveal><h2>Когда одного дня мало</h2></Reveal></div>
          <Link className="btn btn--ghost btn--sm" href="/tours">Все туры <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid--feat">
          {MULTI_DAY.map((s) => { const t = bySlug(s)!; return <TourCard key={s} t={t} />; })}
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="values">
          <div className="value"><em>01</em><h3>Свои маршруты</h3><p>Мы не перепродаём чужие туры. Каждый маршрут проехан нами десятки раз — в разную погоду и в разный сезон.</p></div>
          <div className="value"><em>02</em><h3>Малые группы</h3><p>Максимум шесть человек в джипе. Вы едете со своими, а не со случайным автобусом на сорок мест.</p></div>
          <div className="value"><em>03</em><h3>Гибкость по погоде</h3><p>На Байкале погода решает. Мы меняем точки в течение дня, чтобы поймать свет и уйти от ветра.</p></div>
        </div>
      </section>

      <section className="section wrap">
        <div className="shead"><div><p className="label">Отзывы</p><Reveal><h2>Что говорят путешественники</h2></Reveal></div></div>
        <div className="quotes">
          {QUOTES.map((q) => (
            <Reveal key={q[0]}>
              <figure className="quote">
                <p>«{q[2]}»</p>
                <figcaption className="who"><span className="av">{q[0][0]}</span><span><b>{q[0]}</b><span>{q[1]}</span></span></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--tight wrap">
        <Reveal><CtaBand note="Свободные даты на ледовый сезон" /></Reveal>
      </section>
    </>
  );
}
