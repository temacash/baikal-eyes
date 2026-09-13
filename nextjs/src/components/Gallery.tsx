'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Scene from './Scene';

export default function Gallery({ scenes, title }: { scenes: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="gallery">
        {scenes.map((s, i) => (
          <figure key={s + i} className={`g${i}`} tabIndex={0} onClick={() => setOpen(i)}
            onKeyDown={(e) => { if (e.key === 'Enter') setOpen(i); }}>
            <Scene scene={s} seed={200 + i} label={`${title} — кадр ${i + 1}`} />
          </figure>
        ))}
      </div>
      <div className={'lightbox' + (open !== null ? ' on' : '')} aria-hidden={open === null}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        <button className="x" aria-label="Закрыть" onClick={() => setOpen(null)}><X size={18} /></button>
        {open !== null && (
          <div style={{ width: 'min(1280px, 90vw)', aspectRatio: '16 / 10' }}>
            <Scene scene={scenes[open]} seed={200 + open} eager label={`${title} — кадр ${open + 1}`}
              className="w-full h-full" />
          </div>
        )}
      </div>
    </>
  );
}
