import type { Metadata } from 'next';
import './admin/admin.css';

export const metadata: Metadata = {
  title: 'Панель управления — Baikal Eyes',
  robots: { index: false, follow: false, nocache: true },
};

/* Админка живёт отдельно от сайта: своя разметка документа, без шапки,
   подвала, заставки и шрифтов сайта. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="admin">{children}</body>
    </html>
  );
}
