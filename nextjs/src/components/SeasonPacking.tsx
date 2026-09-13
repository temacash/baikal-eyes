'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PACKING } from '@/lib/packing';

export default function SeasonPacking() {
  const [k, setK] = useState(PACKING.seasons[0].k);
  const season = PACKING.seasons.find((s) => s.k === k)!;

  return (
    <>
      <div className="filters" role="tablist" aria-label="Сезон">
        {PACKING.seasons.map((s) => (
          <button key={s.k} role="tab" aria-selected={s.k === k}
            className={'chip seasontab' + (s.k === k ? ' on' : '')}
            onClick={() => setK(s.k)}>
            {s.n}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={k}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: .35 }}>
          <p className="lead" style={{ marginBottom: 26 }}>{season.note}</p>
          <div className="packgrid">
            {season.cols.map((c) => (
              <div className="packcol" key={c.h}>
                <h3>{c.h}</h3>
                <ul className="checks one">
                  {c.items.map((t) => <li key={t}><Check size={16} /><span>{t}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
