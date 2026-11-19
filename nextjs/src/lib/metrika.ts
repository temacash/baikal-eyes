/* Яндекс.Метрика. Счётчик ставится только на публичные страницы сайта — группа (site).
   В админку его не подключаем: Вебвизор записал бы экран с заявками клиентов. */

export const METRIKA_ID = 114381101;

/** Официальный код счётчика из кабинета Метрики — без изменений. */
export const METRIKA_SNIPPET = `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');

ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`;

type Ym = (id: number, method: string, ...args: unknown[]) => void;

/** Переход между страницами без перезагрузки (Next.js) — сообщаем Метрике вручную. */
export function metrikaHit(url: string, referer: string) {
  const ym = (window as unknown as { ym?: Ym }).ym;
  if (typeof ym === 'function') ym(METRIKA_ID, 'hit', url, { title: document.title, referer });
}
