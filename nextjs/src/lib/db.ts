/* Тонкий клиент к Supabase (PostgREST) на обычном fetch — без внешних зависимостей.
   Ключ service_role используется ТОЛЬКО на сервере и никогда не попадает в браузер. */

const URL_ = process.env.SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_KEY || '';

export const dbReady = () => Boolean(URL_ && KEY);

function headers(extra?: Record<string, string>) {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** Вставка одной строки. Ошибки не роняют сайт — только пишутся в лог. */
export async function insert(table: string, row: Record<string, unknown>): Promise<boolean> {
  if (!dbReady()) return false;
  try {
    const r = await fetch(`${URL_}/rest/v1/${table}`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
      cache: 'no-store',
    });
    if (!r.ok) console.error('[db] insert', table, r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error('[db] insert failed', e);
    return false;
  }
}

/** Выборка: query — строка параметров PostgREST, например
 *  "select=*&ts=gte.2026-01-01&order=ts.desc&limit=200" */
export async function select<T>(table: string, query: string): Promise<T[]> {
  if (!dbReady()) return [];
  try {
    const r = await fetch(`${URL_}/rest/v1/${table}?${query}`, {
      headers: headers(),
      cache: 'no-store',
    });
    if (!r.ok) {
      console.error('[db] select', table, r.status, await r.text());
      return [];
    }
    return (await r.json()) as T[];
  } catch (e) {
    console.error('[db] select failed', e);
    return [];
  }
}

/** Обновление строки по id. */
export async function update(table: string, id: number, patch: Record<string, unknown>): Promise<boolean> {
  if (!dbReady()) return false;
  try {
    const r = await fetch(`${URL_}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(patch),
      cache: 'no-store',
    });
    return r.ok;
  } catch {
    return false;
  }
}
