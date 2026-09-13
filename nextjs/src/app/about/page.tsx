import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Scene from '@/components/Scene';
import Reveal from '@/components/Reveal';
import Stats from '@/components/Stats';

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
            <Reveal><p className="lead">Baikal Eyes начинался с одного УАЗа и привычки возить друзей туда, куда не ходят автобусы. Первым маршрутом был лёд Малого моря — мы поехали в феврале, вчетвером, без плана, и вернулись с пониманием, что показывать Байкал можно совсем иначе.</p></Reveal>
            <Reveal delay={.05}><p className="lead" style={{ marginTop: 18 }}>Девять лет спустя у нас несколько подготовленных машин, свои водители-гиды и маршруты, которые мы проехали в любую погоду. Не изменилось одно: мы по-прежнему возим людей так, как возили бы друзей.</p></Reveal>
            <Reveal delay={.1}><p className="lead" style={{ marginTop: 18 }}>Мы живём в Иркутске. Это значит, что маршрут на завтра собирается сегодня вечером — по сводке, по звонку водителю на Ольхон, по тому, куда за ночь ушёл ветер.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight wrap">
        <Stats items={[
          { n: 9, label: 'лет на маршрутах' },
          { n: 2400, suf: '+', label: 'путешественников' },
          { n: 180, suf: '+', label: 'выездов на лёд' },
          { n: 4.9, dec: 1, suf: '/5', label: 'средняя оценка' }
        ]} />
      </section>

      <section className="section wrap">
        <div className="story rev">
          <figure className="storyimg"><Scene scene="steppe" seed={8} label="Джип в Тажеранских степях" /><figcaption>Тажеранские степи, сентябрь</figcaption></figure>
          <div>
            <p className="label" style={{ marginBottom: 18 }}>Почему выбирают нас</p>
            <Reveal><h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 22 }}>Опыт, который нельзя купить в брошюре</h2></Reveal>
            <Reveal delay={.05}><p className="lead">Наши водители выросли здесь. Они знают, где становая щель меняется каждую неделю, в какой бухте не будет ветра и у кого на Ольхоне можно взять свежего омуля в шесть утра.</p></Reveal>
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
            <Reveal><h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 22 }}>Пять человек, один остров и много зимы</h2></Reveal>
            <Reveal delay={.05}><p className="lead">Нас пятеро: три водителя-гида, координатор в Иркутске и фотограф, который ездит с нами в ледовый сезон. Мы не нанимаем сезонных подрядчиков — с вами поедет кто-то из нас.</p></Reveal>
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
