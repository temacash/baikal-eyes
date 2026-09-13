import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import BookingForm from '@/components/BookingForm';
import CtaBand from '@/components/CtaBand';
import { CONTACTS, tgLink, chLink, igLink } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Телефоны, Telegram, канал и Instagram Baikal Eyes, форма заявки. Выезд из Иркутска, маршруты по Байкалу круглый год.'
};

const msg = 'Здравствуйте! Хочу подобрать путешествие по Байкалу.';

export default function ContactsPage() {
  return (
    <>
      <section className="section wrap" style={{ paddingTop: 'clamp(120px,15vw,190px)' }}>
        <div className="shead">
          <div><p className="label">Контакты</p><Reveal><h2>Напишите — ответим в течение часа</h2></Reveal></div>
          <p className="lead" style={{ maxWidth: '38ch' }}>Расскажите, когда вы на Байкале и что хотите увидеть. Подберём маршрут и пришлём смету.</p>
        </div>

        <div className="cgrid">
          <div>
            <div className="clist">
              <div className="crow"><span>Телефон</span><b><a href={`tel:+${CONTACTS.phoneRaw}`}>{CONTACTS.phone}</a></b></div>
              <div className="crow"><span>Второй номер</span><b><a href={`tel:+${CONTACTS.phone2Raw}`}>{CONTACTS.phone2}</a></b></div>
              <div className="crow"><span>Telegram</span><b><a href={tgLink(msg)} target="_blank" rel="noopener">@{CONTACTS.telegram}</a></b></div>
              <div className="crow"><span>Telegram-канал</span><b><a href={chLink()} target="_blank" rel="noopener">@{CONTACTS.channel}</a></b></div>
              <div className="crow"><span>Instagram</span><b><a href={igLink()} target="_blank" rel="noopener">@{CONTACTS.instagram}</a></b></div>
              <div className="crow"><span>Город</span><b>{CONTACTS.city}</b></div>
              <div className="crow"><span>Выезд</span><b>{CONTACTS.pickup}</b></div>
              <div className="crow"><span>Часы работы</span><b>{CONTACTS.hours}</b></div>
            </div>
            <p className="formnote" style={{ marginTop: 16 }}>
              Все контакты редактируются в одном файле — <code>src/lib/contacts.ts</code>.
            </p>

            <div className="mapbox" style={{ marginTop: 28 }}>
              <svg viewBox="0 0 1000 420" role="img" aria-label="Схема: Иркутск и Байкал">
                <defs>
                  <linearGradient id="lake" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#123B50" /><stop offset="1" stopColor="#0C2433" />
                  </linearGradient>
                  <linearGradient id="rte" x1="0" x2="1">
                    <stop offset="0" stopColor="#C5A77B" /><stop offset="1" stopColor="#A9E5F5" />
                  </linearGradient>
                </defs>
                <rect width="1000" height="420" fill="#0A1017" />
                <g opacity=".5" stroke="#1A2A38" strokeWidth="1">
                  {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="420" />)}
                  {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />)}
                </g>
                <path d="M720 20 C640 90, 600 150, 545 210 C500 260, 440 300, 370 340 C330 362, 300 380, 280 400 L330 410 C380 380, 450 340, 510 290 C580 232, 650 150, 730 60 Z" fill="url(#lake)" stroke="#A9E5F5" strokeOpacity=".35" />
                <path d="M600 150 C570 180, 540 205, 520 225 L545 240 C570 215, 600 185, 625 160 Z" fill="#0E2C3C" stroke="#A9E5F5" strokeOpacity=".5" />
                <text x="556" y="196" fill="#A9E5F5" fontSize="13" transform="rotate(-40 556 196)">Ольхон</text>
                <path d="M180 300 L520 228" stroke="url(#rte)" strokeWidth="2" strokeDasharray="7 8" />
                <circle cx="180" cy="300" r="8" fill="#0B1117" stroke="#C5A77B" strokeWidth="2" />
                <text x="180" y="330" fill="#F5F7F8" fontSize="17" textAnchor="middle">Иркутск</text>
                <text x="180" y="352" fill="#8798A3" fontSize="12" textAnchor="middle">52.2871° N · 104.2810° E</text>
                <circle cx="520" cy="228" r="6" fill="#A9E5F5" />
                <text x="520" y="212" fill="#F5F7F8" fontSize="14" textAnchor="middle">МРС · переправа</text>
                <text x="340" y="268" fill="#C5A77B" fontSize="12" textAnchor="middle" transform="rotate(-12 340 268)">256 км · 4 часа</text>
              </svg>
              <div className="mlegend">
                <span><b>636 км</b>длина озера</span>
                <span><b>1 642 м</b>максимальная глубина</span>
                <span><b>25 млн лет</b>возраст</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bookcard">
              <p className="label label--plain">Форма обратной связи</p>
              <h3 style={{ fontSize: '1.5rem', margin: '16px 0 22px', letterSpacing: '-.03em' }}>Подобрать путешествие</h3>
              <BookingForm withSelect idPrefix="cf" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight wrap">
        <Reveal><CtaBand /></Reveal>
      </section>
    </>
  );
}
