import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from './ui/toast';

export const metadata: Metadata = {
  title: 'Job Quest',
  description: 'Try a job before you choose a job',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
