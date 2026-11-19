'use client';

import { useCallback, useEffect, useState } from 'react';
import TrendChart, { Point } from '@/components/admin/TrendChart';
import BarList, { Row } from '@/components/admin/BarList';

type Lead = {
  id: number; ts: string; name: string | null; contact: string | null; people: string | null;
  want_date: string | null; note: string | null; tour: string | null; city: string | null;
  device: string | null; status: string;
};
type Visit = {
  ts: string; page: string; path: string; city: string | null; country: string | null;
  device: string | null; os: string | null; browser: string | null; source: string | null; isNew: boolean;
};
type Data = {
  days: number;
  summary: {
    views: number; visitors: number; sessions: number; perSession: number; newShare: number;
    todayViews: number; todayVisitors: number; leads: number; leadsNew: number; clicks: number;
  };
  series: Point[];
  pages: Row[]; routes: Row[]; sources: Row[]; cities: Row[]; devices: Row[]; browsers: Row[];
  clicks: Row[]; clicksByTour: Row[];
  recent: Visit[];
  leads: Lead[];
};

const RANGES = [
  { d: 7, n: '7 дней' },
  { d: 30, n: '30 дней' },
  { d: 90, n: '90 дней' },
  { d: 365, n: 'Год' },
];

const STATUS: Record<string, string> = { new: 'Новая', in_work: 'В работе', done: 'Оформлена', spam: 'Спам' };

const dt = (ts: string) =>
  new Date(ts).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const dev = (d: string | null) => (d === 'phone' ? 'Телефон' : d === 'tablet' ? 'Планшет' : d === 'desktop' ? 'Компьютер' : '—');

export default function AdminPage() {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async (d: number) => {
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/data?days=${d}`, { cache: 'no-store' });
      if (r.status === 401) { setAuthed(false); setData(null); return; }
      const j = await r.json();
      if (!r.ok) { setAuthed(true); setErr(j.message || 'Не удалось получить данные.'); setData(null); return; }
      setAuthed(true); setErr(''); setData(j as Data);
    } catch {
      setErr('Сервер не отвечает.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(j.error || 'Не удалось войти.'); return; }
    setPass(''); load(days);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false); setData(null);
  };

  const setStatus = async (id: number, status: string) => {
    setData((d) => (d ? { ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, status } : l)) } : d));
    await fetch('/api/admin/data', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }),
    });
  };

  if (authed === null) return <div className="awrap"><p className="aempty">Загрузка…</p></div>;

  if (!authed) {
    return (
      <div className="awrap alogin">
        <form onSubmit={login}>
          <p className="alabel">Baikal Eyes</p>
          <h1>Панель управления</h1>
          <input
            type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            placeholder="Пароль" autoFocus autoComplete="current-password"
          />
          <button className="abtn" disabled={busy || !pass}>{busy ? 'Проверяем…' : 'Войти'}</button>
          {err && <p className="aerr">{err}</p>}
        </form>
      </div>
    );
  }

  const s = data?.summary;
  const visits = data?.recent || [];

  return (
    <div className="awrap">
      <header className="atop">
        <div>
          <p className="alabel">Baikal Eyes</p>
          <h1>Аналитика сайта</h1>
        </div>
        <div className="atop__tools">
          {RANGES.map((r) => (
            <button key={r.d} className={'achip' + (days === r.d ? ' on' : '')} onClick={() => setDays(r.d)}>{r.n}</button>
          ))}
          <button className="alink" onClick={() => load(days)} disabled={busy}>{busy ? '…' : 'Обновить'}</button>
          <button className="alink" onClick={logout}>Выйти</button>
        </div>
      </header>

      {err && <p className="aerr aerr--wide">{err}</p>}

      {s && (
        <>
          <div className="atiles">
            <Tile n={s.todayViews} t="Просмотров сегодня" s={`${s.todayVisitors} посетителей`} />
            <Tile n={s.views} t={`Просмотров за ${data!.days} дн.`} s={`${s.sessions} визитов`} />
            <Tile n={s.visitors} t="Уникальных посетителей" s={`${s.newShare}% впервые`} />
            <Tile n={s.perSession} t="Страниц за визит" s="Глубина просмотра" />
            <Tile n={s.leads} t="Заявок за период" s={`${s.leadsNew} новых`} accent />
            <Tile n={s.clicks} t="Кликов по контактам" s="Telegram, телефон, бронь" />
          </div>

          <TrendChart data={data!.series} />

          <div className="agrid">
            <BarList title="Страницы" note="Что смотрели чаще всего" rows={data!.pages} />
            <BarList title="Маршруты" note="Страницы туров и экскурсий" rows={data!.routes} />
            <BarList title="Источники" note="Откуда приходят" rows={data!.sources} />
            <BarList title="Города" note="По данным сети, без точного адреса" rows={data!.cities} />
            <BarList title="Устройства" rows={data!.devices} />
            <BarList title="Браузеры" rows={data!.browsers} />
            <BarList title="Клики по контактам" note="Что нажимали" rows={data!.clicks} />
            <BarList title="Интерес по маршрутам" note="С какой страницы писали и звонили" rows={data!.clicksByTour} />
          </div>

          <section className="acard acard--wide">
            <header className="acard__head">
              <div>
                <h2>Заявки с сайта</h2>
                <p className="amuted">Последние 100. Статус меняется в списке справа.</p>
              </div>
            </header>
            {data!.leads.length === 0 ? (
              <p className="aempty">Заявок пока нет. Они появятся здесь сразу после отправки формы.</p>
            ) : (
              <div className="atable-wrap">
                <table className="atable">
                  <thead>
                    <tr><th>Когда</th><th>Имя</th><th>Контакт</th><th>Маршрут</th><th>Чел.</th><th>Дата</th><th>Комментарий</th><th>Статус</th></tr>
                  </thead>
                  <tbody>
                    {data!.leads.map((l) => (
                      <tr key={l.id} className={l.status === 'new' ? 'is-new' : ''}>
                        <td className="anowrap">{dt(l.ts)}</td>
                        <td>{l.name || '—'}</td>
                        <td className="anowrap">{l.contact || '—'}</td>
                        <td>{l.tour || '—'}</td>
                        <td>{l.people || '—'}</td>
                        <td className="anowrap">{l.want_date || '—'}</td>
                        <td className="anote">{l.note || '—'}</td>
                        <td>
                          <select className="asel" value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}>
                            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="acard acard--wide">
            <header className="acard__head">
              <div>
                <h2>Журнал визитов</h2>
                <p className="amuted">Кто и когда заходил: время, страница, город и устройство. Имён нет — сайт не собирает личные данные.</p>
              </div>
            </header>
            {visits.length === 0 ? (
              <p className="aempty">За этот период заходов не было.</p>
            ) : (
              <>
                <div className="atable-wrap">
                  <table className="atable">
                    <thead>
                      <tr><th>Когда</th><th>Страница</th><th>Город</th><th>Источник</th><th>Устройство</th><th>Браузер</th><th></th></tr>
                    </thead>
                    <tbody>
                      {(showAll ? visits : visits.slice(0, 25)).map((v, i) => (
                        <tr key={v.ts + i}>
                          <td className="anowrap">{dt(v.ts)}</td>
                          <td>{v.page}</td>
                          <td>{v.city || '—'}{v.country && v.country !== 'RU' ? `, ${v.country}` : ''}</td>
                          <td>{v.source || '—'}</td>
                          <td className="anowrap">{dev(v.device)}{v.os ? ` · ${v.os}` : ''}</td>
                          <td>{v.browser || '—'}</td>
                          <td>{v.isNew && <span className="atag">впервые</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {visits.length > 25 && (
                  <button className="alink" onClick={() => setShowAll((x) => !x)}>
                    {showAll ? 'Свернуть' : `Показать все ${visits.length}`}
                  </button>
                )}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Tile({ n, t, s, accent }: { n: number; t: string; s?: string; accent?: boolean }) {
  return (
    <div className={'atile' + (accent ? ' atile--accent' : '')}>
      <b>{n.toLocaleString('ru-RU')}</b>
      <span>{t}</span>
      {s && <em>{s}</em>}
    </div>
  );
}
