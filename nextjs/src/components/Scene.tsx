'use client';
import { useEffect, useRef } from 'react';
import { paintScene } from '@/lib/scenes';

type Props = {
  scene: string;
  seed?: number;
  label?: string;
  className?: string;
  /** рисовать сразу, не дожидаясь появления в зоне видимости (для hero) */
  eager?: boolean;
};

/**
 * Процедурная сцена Байкала на canvas.
 * Чтобы поставить реальную фотографию — замените содержимое на
 * <Image src={...} alt={label} fill className="object-cover" />
 */
export default function Scene({ scene, seed, label = '', className = '', eager = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let done = false;
    const paint = () => { if (!done) { paintScene(cv, scene, seed); done = true; } };

    if (eager) requestAnimationFrame(paint);
    let io: IntersectionObserver | undefined;
    if (!eager) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { paint(); io?.disconnect(); } });
      }, { rootMargin: '400px 0px' });
      io.observe(cv);
    }

    let t: ReturnType<typeof setTimeout>;
    let lastW = window.innerWidth;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (Math.abs(window.innerWidth - lastW) < 60 || !done) return;
        lastW = window.innerWidth;
        paintScene(cv, scene, seed);
      }, 260);
    };
    window.addEventListener('resize', onResize);
    return () => { io?.disconnect(); window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [scene, seed, eager]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
