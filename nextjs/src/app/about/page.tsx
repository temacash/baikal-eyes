import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Scene from '@/components/Scene';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'О нас',
  description: 'Baikal Eyes — команда из Иркутска: свои маршруты, свои водители-гиды, малые группы и круглогодичные выезды на Байкал.'
};

export default function AboutPage() {
  return (
    <>
      <section className="section wrap" style={{ paddingTop: 'clamp(120px,15vw,190px)' }}>
        <p className="label">О нас</p>
        <Reveal><h1 className="bigquote" style={{ margin: '26px 0 40px' }}>
          Мы показываем Байкал не как <span>туристическую открытку</span>, а как живое место, которое хочется почувствовать.
        </h1></Reveal>
        <div className="story">
          <figure className="storyimg"><Scene scene="people" seed={12} label="Команда Baikal Eyes на берегу" /><figcaption>Мыс Хобой, февраль</figcaption></figure>
          <div>
            <p className="label" style={{ marginBottom: 18 }}>История</p>
            <Reveal><p className="lead">Baikal Eyes начинался с привычки возить друзей туда, куда не ходят автобусы: на лёд Малого моря, на Ольхон, в места, где Байкал открывается без толпы. Со временем из этого выросли маршруты, которые мы возим круглый год.</p></Reveal>
            <Reveal delay={.05}><p className="lead" style={{ marginTop: 18 }}>Мы встречаем гостей в аэропорту, ведём весь день и возвращаем к месту проживания. Программу подстраиваем под погоду и под тех, кто едет: с детьми, со съёмкой, с ровным темпом или без остановок.</p></Reveal>
            <Reveal delay={.1}><p className="lead" style={{ marginTop: 18 }}>Мы живём в Иркутске. Это значит, что маршрут на завтра собирается сегодня вечером — по сводке, по звонку водителю на остров, по тому, куда за ночь ушёл ветер.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="story rev">
          <figure className="storyimg"><Scene scene="steppe" seed={8} label="Джип в Тажеранских степях" /><figcaption>Тажеранские степи, сентябрь</figcaption></figure>
          <div>
            <p className="label" style={{ marginBottom: 18 }}>Почему выбирают нас</p>
            <Reveal><h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 22 }}>Опыт, который нельзя купить в брошюре</h2></Reveal>
            <Reveal delay={.05}><p className="lead">Наши водители выросли здесь. Они знают, где становая щель меняется каждую неделю, в какой бухте не будет ветра и у кого на острове можно взять свежего омуля в шесть утра.</p></Reveal>
            <Reveal delay={.1}><p className="lead" style={{ marginTop: 18 }}>Мы отвечаем за безопасность серьёзно: только официальные ледовые переправы, спутниковый трекер в каждой машине, аптечка, страховка и запас времени в расписании.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight wrap">
        <div className="values">
          <div className="value"><em>01</em><h3>Индивидуальный подход</h3><p>Маршрут подстраивается под вас: темп, интересы, дети, съёмка, юбилей. Мы спрашиваем, зачем вы едете, прежде чем предлагать программу.</p></div>
          <div className="value"><em>02</em><h3>Безопасность и комфорт</h3><p>Подготовленные внедорожники, опытные водители, страховка, связь и запас по времени. На льду — только проверенные маршруты.</p></div>
          <div className="value"><em>03</em><h3>Настоящие впечатления</h3><p>Без бутафории и без гонки по точкам. Мы останавливаемся там, где красиво, и молчим там, где нужно слушать.</p></div>
        </div>
      </section>

      <section className="section wrap">
        <div className="story">
          <figure className="storyimg"><Scene scene="night" seed={64} label="Ночное небо над Байкалом" /><figcaption>Малое море, ночь на льду</figcaption></figure>
          <div>
            <p className="label" style={{ marginBottom: 18 }}>Команда</p>
            <Reveal><h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 22 }}>С вами поедет кто-то из нас</h2></Reveal>
            <Reveal delay={.05}><p className="lead">Мы небольшая команда и не передаём гостей сезонным подрядчикам: маршрут ведёт тот, кто его собирал. Поэтому программу можно менять на ходу — по погоде, по настроению группы, по тому, где сегодня лучше свет.</p></Reveal>
            <div className="btnrow" style={{ marginTop: 28 }}>
              <Link className="btn" href="/tours">Смотреть маршруты <ArrowRight size={15} /></Link>
              <Link className="btn btn--ghost" href="/contacts">Связаться</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
