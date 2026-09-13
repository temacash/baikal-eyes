import Link from 'next/link';
import { CONTACTS, tgLink, chLink, igLink } from '@/lib/contacts';
import { Brand } from './Nav';

const FOUNDED = 2024;

export default function Footer() {
  const now = new Date().getFullYear();
  const year = now > FOUNDED ? `${FOUNDED}—${now}` : String(FOUNDED);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div className="fcol">
            <Link className="brand brand--f" href="/" aria-label="Baikal Eyes">
              <Brand footer caption="Иркутск • Байкал • Ольхон" />
            </Link>
            <p className="muted" style={{ fontSize: '.9rem', fontWeight: 300, maxWidth: '34ch', marginTop: 18 }}>
              Авторские экскурсии, джип-туры и путешествия по Байкалу и Иркутску. Малые группы, свои маршруты, круглый год.
            </p>
          </div>
          <div className="fcol">
            <h4>Экскурсии на день</h4>
            <Link href="/excursions">Все экскурсии</Link>
            <Link href="/excursions?f=city">Иркутск и окрестности</Link>
            <Link href="/excursions?f=winter">Зимний Байкал</Link>
            <Link href="/excursions?f=jeep">Джип-выезды</Link>
          </div>
          <div className="fcol">
            <h4>Многодневные туры</h4>
            <Link href="/tours">Все туры</Link>
            <Link href="/tours?f=olkhon">Ольхон</Link>
            <Link href="/tours?f=winter">Ледовые экспедиции</Link>
            <Link href="/tours?f=custom">Индивидуальные</Link>
            <Link href="/packing">Что взять с собой</Link>
          </div>
          <div className="fcol">
            <h4>Связаться</h4>
            <a href={`tel:+${CONTACTS.phoneRaw}`}>{CONTACTS.phone}</a>
            <a href={`tel:+${CONTACTS.phone2Raw}`}>{CONTACTS.phone2}</a>
            <a href={tgLink()} target="_blank" rel="noopener">Telegram @{CONTACTS.telegram}</a>
            <a href={chLink()} target="_blank" rel="noopener">Канал @{CONTACTS.channel}</a>
            <a href={igLink()} target="_blank" rel="noopener">Instagram @{CONTACTS.instagram}</a>
          </div>
        </div>
        <div className="fbot">
          <span>© {year} Baikal Eyes. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}
