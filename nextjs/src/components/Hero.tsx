'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const line = (delay: number) => ({
  initial: { y: '105%' },
  animate: { y: 0 },
  transition: { duration: 1.15, delay, ease: [0.16, 1, 0.3, 1] as const }
});

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 200]);

  return (
    <section className="hero">
      <motion.div className="hero__bg" style={{ y }}>
        {/* Фотография первого экрана. Заменить — положить новый файл в public/images/ */}
        <picture>
          <source media="(max-width:700px)" srcSet="/images/hero-portrait.jpg" />
          <img src="/images/hero.jpg" alt="Мыс и бирюзовая вода Байкала летом" fetchPriority="high" decoding="async" />
        </picture>
      </motion.div>
      <div className="hero__in">
        <motion.p className="hero__eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: .15 }}><s /> Экскурсии и путешествия по Байкалу</motion.p>
        <h1 className="hero__t">
          <span className="ln"><motion.span {...line(.1)}>Увидеть Байкал.</motion.span></span>
          <span className="ln"><motion.span {...line(.22)}>Почувствовать его.</motion.span></span>
          <span className="ln"><motion.span className="serif" {...line(.34)}>Запомнить навсегда.</motion.span></span>
        </h1>
        <motion.div className="hero__bottom" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: .6, ease: [0.16, 1, 0.3, 1] }}>
          <div>
            <p className="hero__sub">Авторские маршруты, джип-туры и экскурсии по Байкалу и Иркутску — глазами тех, кто здесь живёт.</p>
            <p className="hero__geo"><em>53.5587° N</em> · <em>108.1650° E</em> · Иркутск • Байкал • Ольхон</p>
          </div>
          <div className="btnrow">
            <Link className="btn" href="/tours">Туры на Байкал <ArrowRight size={15} /></Link>
            <Link className="btn btn--ghost" href="/excursions">Экскурсии на день</Link>
          </div>
        </motion.div>
      </div>
      <div className="scrollhint" aria-hidden="true">Листайте</div>
    </section>
  );
}
