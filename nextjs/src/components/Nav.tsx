'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CONTACTS, tgLink, chLink, igLink } from '@/lib/contacts';
import { LogoMark, LogoWord } from './Logo';

const LINKS = [
  { href: '/excursions', label: 'Экскурсии' },
  { href: '/tours', label: 'Туры' },
  { href: '/packing', label: 'Что взять' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' }
];

export const Brand = ({ footer = false, caption = 'Иркутск • Байкал' }: { footer?: boolean; caption?: string }) => (
  <>
    <LogoMark />
    <span className="brandtxt">
      <LogoWord />
      <span>{caption}</span>
    </span>
  </>
);

export default function Nav() {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <>
      <header className={'nav' + (solid ? ' solid' : '')}>
        <div className="nav__in">
          <Link className="brand" href="/" aria-label="Baikal Eyes — на главную"><Brand /></Link>
          <nav className="nav__links" aria-label="Основная навигация">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? 'act' : ''}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav__cta">
            <Link className="btn btn--sm" href="/contacts">Подобрать путешествие <ArrowRight size={15} /></Link>
            <button className={'burger' + (open ? ' on' : '')} aria-label="Меню" aria-expanded={open}
              onClick={() => setOpen((v) => !v)}><i /></button>
          </div>
        </div>
      </header>

      <div className={'mmenu' + (open ? ' on' : '')} aria-hidden={!open}>
        <nav>
          <Link className="ml" href="/">Главная</Link>
          {LINKS.map((l) => <Link key={l.href} className="ml" href={l.href}>{l.label}</Link>)}
        </nav>
        <div className="mbottom">
          <LogoWord className="lg lg--word mlogo" />
          <div className="mfoot">
            <a href={`tel:+${CONTACTS.phoneRaw}`}>{CONTACTS.phone}</a>
            <a href={`tel:+${CONTACTS.phone2Raw}`}>{CONTACTS.phone2}</a>
            <a href={tgLink()} target="_blank" rel="noopener">Telegram @{CONTACTS.telegram}</a>
            <a href={chLink()} target="_blank" rel="noopener">Канал @{CONTACTS.channel}</a>
            <a href={igLink()} target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
    </>
  );
}
