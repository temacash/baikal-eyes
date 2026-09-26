import Scene from './Scene';
import type { Tour } from '@/lib/data';

/** Фотография маршрута, если она загружена; иначе — процедурная сцена. */
export default function TourMedia({ t, kind, eager = false }: { t: Tour; kind: 'cover' | 'hero'; eager?: boolean }) {
  const src = kind === 'cover' ? t.photos?.cover : t.photos?.hero;
  if (src) {
    return (
      <img src={src} alt={t.title}
        {...(eager ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
        decoding="async" />
    );
  }
  return <Scene scene={t.scene || 'dawn'} seed={t.seed ?? 11} eager={eager} label={t.title} />;
}
