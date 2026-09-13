# Как выкатить сайт на Vercel

Репозиторий git уже создан в этой папке, первый коммит сделан.
Осталось: залить на GitHub → импортировать в Vercel.

## Шаг 1. Проверить сборку у себя

```bash
cd ~/"site baikal eyes"/nextjs
npm run build
```

Должно закончиться таблицей страниц без ошибок. Если ошибок нет — идём дальше.

## Шаг 2. Создать репозиторий на GitHub

**Вариант А — через сайт.** github.com → New repository → имя `baikal-eyes` →
Private (или Public) → **без** README, .gitignore и лицензии → Create repository.
Затем в терминале:

```bash
cd ~/"site baikal eyes"
git remote add origin https://github.com/ВАШ_ЛОГИН/baikal-eyes.git
git push -u origin main
```

**Вариант Б — если установлен GitHub CLI:**

```bash
cd ~/"site baikal eyes"
gh repo create baikal-eyes --private --source=. --push
```

Автор коммита сейчас: Baikal Eyes <anarcloude@proton.me>.
Поменять: `git config user.email "другая@почта"` (для будущих коммитов).

## Шаг 3. Импортировать проект в Vercel

1. vercel.com → **Add New… → Project**.
2. **Import Git Repository** → найти `baikal-eyes` → **Import**.
   Если репозитория нет в списке: **Adjust GitHub App Permissions** → дать доступ к нему.
3. **ВАЖНО:** в блоке настроек найти **Root Directory** → **Edit** → выбрать папку `nextjs` → **Continue**.
   Проект лежит не в корне репозитория, без этого сборка упадёт.
4. Framework Preset должен определиться как **Next.js**. Build Command, Output Directory,
   Install Command — оставить по умолчанию. Переменные окружения не нужны.
5. **Deploy**. Сборка занимает 1–3 минуты.

Получите адрес вида `baikal-eyes.vercel.app`.

## Шаг 4. Свой домен

Project → **Settings → Domains** → Add Domain → ввести домен.
Vercel покажет, какие записи прописать у регистратора домена:

- домен без www (`baikaleyes.ru`) → запись **A** на IP, который покажет Vercel;
- домен с www → запись **CNAME** на `cname.vercel-dns.com`.

После подключения домена поменяйте адрес в двух местах проекта:
`nextjs/src/app/layout.tsx` (`metadataBase`) и `nextjs/src/app/sitemap.ts` (`base`).

## Шаг 5. Как обновлять сайт дальше

```bash
cd ~/"site baikal eyes"
git add -A
git commit -m "что изменилось"
git push
```

Каждый push в ветку `main` запускает новый деплой автоматически.
Правки контента: цены и программы — `nextjs/src/lib/data.ts`,
контакты — `nextjs/src/lib/contacts.ts`, памятка — `nextjs/src/lib/packing.ts`.

## Что важно знать про бесплатный план

- **Проектов на Hobby — до 200.** Второй проект добавляется спокойно, ничего не удаляя.
- Лимиты считаются на аккаунт целиком, не на проект: 100 ГБ трафика в месяц,
  1 млн запросов, 100 деплоев в день. Для сайта турфирмы этого с запасом.
- **Hobby разрешён только для некоммерческого использования.** Сайт, который продаёт туры, —
  коммерческий, формально для него нужен план Pro ($20/мес). На практике небольшие сайты
  живут на Hobby, но Vercel вправе приостановить проект.
- Оплата Pro российской картой не проходит.

Альтернативы, где коммерческое использование разрешено бесплатно:
**Cloudflare Pages**, **Netlify**, из российских — **Timeweb Cloud**, **Beget**, **Selectel**.
Сайт можно собрать полностью статикой (`output: 'export'`) — тогда он поедет на любой
из них и даже на обычный хостинг с папкой public_html.
