/* Минимальный разбор user-agent: тип устройства, ОС, браузер, отсев роботов.
   Без внешних библиотек — нам нужна сводка, а не точность до версии. */

export type UaInfo = { device: string; os: string; browser: string; bot: boolean };

const BOT = /bot|crawler|spider|crawling|slurp|bingpreview|yandexbot|googlebot|ahrefs|semrush|headless|lighthouse|pingdom|uptime|curl|wget|python-requests|facebookexternalhit|telegrambot|whatsapp|vkshare|preview/i;

export function parseUa(uaRaw: string | null): UaInfo {
  const ua = uaRaw || '';
  if (!ua || BOT.test(ua)) return { device: 'bot', os: '—', browser: '—', bot: true };

  const tablet = /ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua);
  const phone = !tablet && /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua);
  const device = tablet ? 'tablet' : phone ? 'phone' : 'desktop';

  let os = 'Другая';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod|ios/i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Другой';
  if (/yabrowser/i.test(ua)) browser = 'Яндекс Браузер';
  else if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/firefox\//i.test(ua)) browser = 'Firefox';
  else if (/chrome\//i.test(ua)) browser = 'Chrome';
  else if (/safari\//i.test(ua)) browser = 'Safari';

  return { device, os, browser, bot: false };
}

/** Откуда пришёл человек — приводим ссылку к понятному источнику. */
export function refHost(referrer: string | null | undefined, self: string): string {
  if (!referrer) return 'Прямые заходы';
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, '');
    if (!h || h === self.replace(/^www\./, '')) return 'Прямые заходы';
    if (/yandex\./.test(h)) return 'Яндекс';
    if (/google\./.test(h)) return 'Google';
    if (/t\.me|telegram/.test(h)) return 'Telegram';
    if (/instagram/.test(h)) return 'Instagram';
    if (/vk\.com/.test(h)) return 'ВКонтакте';
    if (/2gis|gis\./.test(h)) return '2ГИС';
    if (/avito/.test(h)) return 'Авито';
    return h;
  } catch {
    return 'Прямые заходы';
  }
}
