/* Контакты компании. Телефоны и Telegram — рабочие; почта, адрес и соцсети — заглушки. */
export const CONTACTS = {
  phone:      '+7 (999) 183-98-55',
  phoneRaw:   '79991839855',
  phone2:     '+7 (999) 808-99-98',
  phone2Raw:  '79998089998',
  telegram:   'AlexaaaGO',     // личный контакт для заявок
  channel:    'baikal_eyes',   // telegram-канал компании
  instagram:  'baikal_eyes',   // instagram
  city:       'Иркутск',
  pickup:     'Выезд из Иркутска: отель, квартира или аэропорт',
  hours:      'Ежедневно, 08:00 — 22:00 (IRKT, UTC+8)'
};

export const tgLink = (text?: string) =>
  `https://t.me/${CONTACTS.telegram}` + (text ? `?text=${encodeURIComponent(text)}` : '');
export const chLink = () => `https://t.me/${CONTACTS.channel}`;
export const igLink = () => `https://instagram.com/${CONTACTS.instagram}`;
export const money = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ');
