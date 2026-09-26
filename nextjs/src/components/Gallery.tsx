'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!photos.length) return null;

  return (
    <>
      <div className="gallery">
        {photos.map((src, i) => (
          <figure key={src} className={`g${i}`} tabIndex={0} onClick={() => setOpen(i)}
            onKeyDown={(e) => { if (e.key === 'Enter') setOpen(i); }}>
            <img src={src} alt={`${title} — фото ${i + 1}`} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      <div className={'lightbox' + (open !== null ? ' on' : '')} aria-hidden={open === null}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        <button className="x" aria-label="Закрыть" onClick={() => setOpen(null)}><X size={18} /></button>
        {open !== null && <img src={photos[open]} alt={`${title} — фото ${open + 1}`} />}
      </div>
    </>
  );
}
