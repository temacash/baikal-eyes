'use client';
import { useState } from 'react';
import { ArrowRight, Phone, Send, Radio } from 'lucide-react';
import { CONTACTS, tgLink, chLink } from '@/lib/contacts';
import { TOURS } from '@/lib/data';

type Props = { tourTitle?: string; withSelect?: boolean; idPrefix?: string };

export default function BookingForm({ tourTitle, withSelect = false, idPrefix = 'bf' }: Props) {
  const [sent, setSent] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;
    const text = [
      'Заявка с сайта Baikal Eyes',
      tourTitle ? `Маршрут: ${tourTitle}` : d.tour ? `Маршрут: ${d.tour}` : '',
      `Имя: ${d.name || '—'}`,
      `Контакт: ${d.contact || '—'}`,
      `Человек: ${d.people || '—'}`,
      `Дата: ${d.date || 'не выбрана'}`,
      d.note ? `Комментарий: ${d.note}` : ''
    ].filter(Boolean).join('\n');

    // TODO: здесь можно отправить заявку на бэкенд / в Telegram-бота:
    // await fetch('/api/lead', { method: 'POST', body: JSON.stringify(d) });
    setSent(text);
    window.open(tgLink(text), '_blank', 'noopener');
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="field full">
        <label htmlFor={`${idPrefix}-name`}>Имя</label>
        <input id={`${idPrefix}-name`} name="name" required placeholder="Как к вам обращаться" />
      </div>
      <div className="field full">
        <label htmlFor={`${idPrefix}-contact`}>Телефон или Telegram</label>
        <input id={`${idPrefix}-contact`} name="contact" required placeholder="+7 … или @username" />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-people`}>Человек</label>
        <input id={`${idPrefix}-people`} name="people" type="number" min={1} max={20} defaultValue={2} />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-date`}>Желаемая дата</label>
        <input id={`${idPrefix}-date`} name="date" type="date" />
      </div>
      {withSelect && (
        <div className="field full">
          <label htmlFor={`${idPrefix}-tour`}>Интересует</label>
          <select id={`${idPrefix}-tour`} name="tour" defaultValue="Ещё не выбрали">
            <option value="Ещё не выбрали">Ещё не выбрали — подскажите</option>
            {TOURS.map((t) => <option key={t.slug} value={t.title}>{t.title}</option>)}
          </select>
        </div>
      )}
      <div className="field full">
        <label htmlFor={`${idPrefix}-note`}>Комментарий</label>
        <textarea id={`${idPrefix}-note`} name="note" placeholder="Пожелания, состав группы, особенности маршрута" />
      </div>
      <div className="full">
        <button className="btn btn--full" type="submit">Отправить заявку <ArrowRight size={15} /></button>
      </div>
      <div className="contactline full">
        <a className="iconbtn" href={tgLink('Здравствуйте! Хочу подобрать путешествие по Байкалу.')} target="_blank" rel="noopener"><Send size={15} /> Telegram</a>
        <a className="iconbtn" href={chLink()} target="_blank" rel="noopener"><Radio size={15} /> Канал</a>
        <a className="iconbtn" href={`tel:+${CONTACTS.phoneRaw}`}><Phone size={15} /></a>
      </div>
      {sent && (
        <div className="sent on full">
          Заявка собрана. Открываем Telegram — если окно не появилось, скопируйте текст ниже.
          <pre style={{ whiteSpace: 'pre-wrap', margin: '12px 0 0', font: 'inherit', fontSize: '.82rem', color: '#A9E5F5' }}>{sent}</pre>
        </div>
      )}
    </form>
  );
}
