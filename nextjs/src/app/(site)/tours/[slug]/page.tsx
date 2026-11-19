import type { Metadata } from 'next';
import RoutePage from '@/components/RoutePage';
import { byKind, bySlug } from '@/lib/data';

export function generateStaticParams() {
  return byKind('tour').map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = bySlug(params.slug);
  if (!t) return { title: 'Маршрут не найден' };
  return { title: t.title, description: t.short, openGraph: { title: `${t.title} — Baikal Eyes`, description: t.short } };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <RoutePage slug={params.slug} />;
}
