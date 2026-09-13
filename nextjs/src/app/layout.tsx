import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  metadataBase: new URL('https://baikaleyes.ru'),
  title: { default: 'Baikal Eyes — экскурсии и путешествия по Байкалу', template: '%s — Baikal Eyes' },
  description: 'Авторские экскурсии, джип-туры и путешествия по Байкалу и Иркутску. Малые группы, свои маршруты, круглый год.',
  keywords: ['Байкал', 'экскурсии', 'Ольхон', 'джип-тур', 'Иркутск', 'зимний Байкал', 'Хобой', 'Тажеранские степи'],
  openGraph: {
    type: 'website', locale: 'ru_RU', siteName: 'Baikal Eyes',
    title: 'Baikal Eyes — увидеть Байкал глазами тех, кто его знает',
    description: 'Экскурсии, джип-туры и путешествия по Байкалу и Иркутску.'
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
