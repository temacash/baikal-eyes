import type { MetadataRoute } from 'next';
import { byKind } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://baikaleyes.ru';
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/excursions`, lastModified: now, priority: .9 },
    { url: `${base}/tours`, lastModified: now, priority: .9 },
    { url: `${base}/packing`, lastModified: now, priority: .8 },
    { url: `${base}/about`, lastModified: now, priority: .7 },
    { url: `${base}/contacts`, lastModified: now, priority: .7 },
    ...byKind('excursion').map((t) => ({ url: `${base}/excursions/${t.slug}`, lastModified: now, priority: .8 })),
    ...byKind('tour').map((t) => ({ url: `${base}/tours/${t.slug}`, lastModified: now, priority: .8 }))
  ];
}
