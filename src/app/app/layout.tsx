// src/app/app/layout.tsx  (server component)
import HeaderClient from './HeaderClient';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HeaderClient />
      <main className="max-w-5xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
