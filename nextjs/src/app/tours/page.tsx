import type { Metadata } from 'next';
import Catalog from '@/components/Catalog';

export const metadata: Metadata = {
  title: 'Многодневные туры',
  description: 'Туры с ночёвками: лёд Ольхона, остров силы, большое кольцо Байкала, КБЖД, Аршан и индивидуальные маршруты.'
};

export default function ToursPage({ searchParams }: { searchParams: { f?: string } }) {
  return (
    <section className="section wrap" style={{ paddingTop: 'clamp(120px,15vw,190px)' }}>
      <Catalog kind="tour" initial={searchParams.f || 'all'} />
    </section>
  );
}
