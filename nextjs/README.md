# Baikal Eyes — сайт туристической компании

Премиальный многостраничный сайт: Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + Lucide.

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

Деплой на Vercel — без дополнительной настройки (`vercel` или импорт репозитория).

## Структура

```
src/
  app/
    layout.tsx            шрифты (Manrope + Cormorant Garamond), метаданные, шапка и подвал
    template.tsx          плавный переход между страницами (Framer Motion)
    page.tsx                   главная: hero, манифест, «Выберите свой Байкал», экскурсии, туры, отзывы
    excursions/page.tsx        каталог однодневных экскурсий (5 маршрутов)
    excursions/[slug]/page.tsx страница экскурсии (SSG)
    tours/page.tsx             каталог многодневных туров (6 маршрутов)
    tours/[slug]/page.tsx      страница тура (SSG)
    about/page.tsx        о компании
    contacts/page.tsx     контакты, схема, форма заявки
    sitemap.ts            карта сайта
  components/             Nav, Footer, Logo, Hero, Scene, Reveal, TourCard, MoodPicker, Catalog,
                          RoutePage, BookingForm, Gallery, RouteMap, Faq, Stats, CtaBand
  lib/
    data.ts               маршруты, категории, деление на экскурсии/туры (EXCURSION_SLUGS),
                          подборки «настроений» — основной контент
    contacts.ts           контакты компании (заглушки — заменить на реальные)
    scenes.ts             процедурные кинематографичные сцены на canvas
```

## Что заменить в первую очередь

1. **Контакты** — `src/lib/contacts.ts`. Телефоны (+7 999 183-98-55, +7 999 808-99-98) и Telegram
   (@AlexaaaGO) уже реальные; почта, адрес и соцсети — заглушки.
2. **Домен** — `metadataBase` в `src/app/layout.tsx` и базовый URL в `src/app/sitemap.ts`.
3. **Фотографии** — сейчас визуалы рисуются кодом (`src/lib/scenes.ts`). Чтобы поставить реальные снимки,
   замените тело компонента `src/components/Scene.tsx` на `next/image`:

```tsx
import Image from 'next/image';
export default function Scene({ scene, label }: { scene: string; label?: string }) {
  return <Image src={`/photos/${scene}.jpg`} alt={label ?? ''} fill sizes="100vw" className="object-cover" priority={false} />;
}
```
   Разметка, пропорции и анимации при этом не меняются: файлы кладутся в `public/photos/`
   с именами сцен (`dawn`, `ice`, `grotto`, `olkhon`, `khoboy`, `steppe`, `irkutsk`, `night`, `people`, `taiga`, `shaman`).
4. **Маршруты** — `src/lib/data.ts`: цены, программа, что входит, FAQ, отзывы.
   Маршрут попадает в раздел «Экскурсии», если его slug перечислен в `EXCURSION_SLUGS`,
   иначе — в «Туры». Категории фильтров задаются полем `cat` и списком `CATS`;
   пустые категории в каталоге не показываются.

## Логотип

`src/components/Logo.tsx` — векторная версия фирменного знака (`LogoMark`) и надписи (`LogoWord`),
отрисованных через `currentColor`: цвет наследуется от родителя, размеры задаются классами
`.lg--mark` / `.lg--word` в `globals.css`.

## Приём заявок

`BookingForm` собирает текст заявки и открывает Telegram с готовым сообщением.
Для полноценного приёма заявок добавьте роут `src/app/api/lead/route.ts` и раскомментируйте `fetch('/api/lead')`:

```ts
export async function POST(req: Request) {
  const data = await req.json();
  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT, text: JSON.stringify(data, null, 2) })
  });
  return Response.json({ ok: true });
}
```

## Дальнейшее развитие

Архитектура рассчитана на подключение CMS (данные из `lib/data.ts` заменяются на запрос к Sanity/Strapi/БД
без изменения компонентов), онлайн-бронирования с оплатой, отзывов, админ-панели и интеграции с Telegram-ботом.

## Дизайн-система

Токены и компонентные классы — в `src/app/globals.css` (палитра `#0B1117`, `#123B50`, `#A9E5F5`, `#F5F7F8`, `#C5A77B`).
Tailwind настроен на те же цвета и доступен для точечных правок.

## Примечание о шрифтах

`next/font/google` скачивает Manrope и Cormorant Garamond во время сборки — нужен доступ в интернет
на машине, где выполняется `npm run build`. В офлайн-окружении замените в `src/app/layout.tsx`
`next/font` на обычный `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">`
или положите файлы шрифтов в `public/fonts` и подключите через `next/font/local`.
