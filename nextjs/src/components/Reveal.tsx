'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Reveal({ children, delay = 0, className = '' }:
  { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8%' }}
      transition={{ duration: .95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
