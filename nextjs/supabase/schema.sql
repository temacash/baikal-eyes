-- Baikal Eyes — аналитика и заявки.
-- Выполните этот файл один раз в Supabase → SQL Editor → New query → Run.

-- ────────────────────────────── визиты (просмотры страниц)
create table if not exists public.visits (
  id           bigserial primary key,
  ts           timestamptz not null default now(),
  visitor_id   text not null,          -- анонимный id посетителя (живёт в его браузере)
  session_id   text not null,          -- id одного визита (до 30 минут бездействия)
  is_new       boolean not null default false,
  path         text not null,
  title        text,
  referrer     text,
  ref_host     text,                   -- откуда пришёл: yandex.ru, t.me, instagram.com…
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  country      text,
  region       text,
  city         text,
  device       text,                   -- phone | tablet | desktop
  os           text,
  browser      text,
  screen       text,
  lang         text
);

create index if not exists visits_ts_idx      on public.visits (ts desc);
create index if not exists visits_visitor_idx on public.visits (visitor_id);
create index if not exists visits_path_idx    on public.visits (path);

-- ────────────────────────────── события (клики по контактам и кнопкам)
create table if not exists public.events (
  id         bigserial primary key,
  ts         timestamptz not null default now(),
  visitor_id text,
  session_id text,
  type       text not null default 'click',
  label      text,                     -- book | telegram | channel | phone | instagram | form_open
  path       text,
  tour       text,
  city       text,
  device     text
);

create index if not exists events_ts_idx    on public.events (ts desc);
create index if not exists events_label_idx on public.events (label);

-- ────────────────────────────── заявки с форм бронирования
create table if not exists public.leads (
  id         bigserial primary key,
  ts         timestamptz not null default now(),
  name       text,
  contact    text,
  people     text,
  want_date  text,
  note       text,
  tour       text,
  path       text,
  visitor_id text,
  city       text,
  device     text,
  status     text not null default 'new'   -- new | in_work | done | spam
);

create index if not exists leads_ts_idx on public.leads (ts desc);

-- ────────────────────────────── доступ
-- Включаем RLS и НЕ создаём политик: из браузера таблицы недоступны вообще,
-- сайт пишет и читает их только с сервера по service-role ключу.
alter table public.visits enable row level security;
alter table public.events enable row level security;
alter table public.leads  enable row level security;

-- ────────────────────────────── автоочистка визитов старше года (по желанию)
-- delete from public.visits where ts < now() - interval '365 days';
