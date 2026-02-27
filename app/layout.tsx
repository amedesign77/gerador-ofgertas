import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gerador de Ofertas',
  description: 'Grade automática e exportação PNG 1080x1500'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
