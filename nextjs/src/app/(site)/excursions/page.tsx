import type { Metadata } from 'next';
import Catalog from '@/components/Catalog';

export const metadata: Metadata = {
  title: 'Экскурсии на день',
  description: 'Однодневные выезды: Иркутск, Листвянка и КБЖД, ледяные гроты Малого моря, мыс Хобой, Тажеранские степи.'
};

export default function ExcursionsPage({ searchParams }: { searchParams: { f?: string } }) {
  return (
    <section className="section wrap" style={{ paddingTop: 'clamp(120px,15vw,190px)' }}>
      <Catalog kind="excursion" initial={searchParams.f || 'all'} />
    </section>
  );
}
