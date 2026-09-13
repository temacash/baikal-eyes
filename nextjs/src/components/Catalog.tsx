'use client';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATS, KIND_META, byKind, type Kind } from '@/lib/data';
import TourCard from './TourCard';

export default function Catalog({ kind, initial = 'all' }: { kind: Kind; initial?: string }) {
  const [f, setF] = useState(initial);
  const meta = KIND_META[kind];
  const pool = byKind(kind);
  const list = pool.filter((t) => f === 'all' || t.cat.includes(f));
  const count = (k: string) => (k === 'all' ? pool.length : pool.filter((t) => t.cat.includes(k)).length);
  const chips = CATS.filter((c) => count(c.k) > 0);
  const base = kind === 'tour' ? '/tours' : '/excursions';

  return (
    <>
      <div className="shead">
        <div>
          <p className="label">{meta.label} · {pool.length}</p>
          <h2>{meta.title}</h2>
          <p className="switchline">Смотрите также <Link href={meta.other[0]}>{meta.other[1]} →</Link></p>
        </div>
        <p className="lead" style={{ maxWidth: '40ch' }}>{meta.lead}</p>
      </div>

      <div className="filters" role="tablist">
        {chips.map((c) => (
          <button key={c.k} role="tab" aria-selected={c.k === f}
            className={'chip' + (c.k === f ? ' on' : '')}
            onClick={() => { setF(c.k); history.replaceState(null, '', c.k === 'all' ? base : `${base}?f=${c.k}`); }}>
            {c.n}<b>{count(c.k)}</b>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="grid" key={f}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: .3 }}>
          {list.length ? list.map((t) => <TourCard key={t.slug} t={t} />)
            : <p className="empty">В этой категории пока нет маршрутов.</p>}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
