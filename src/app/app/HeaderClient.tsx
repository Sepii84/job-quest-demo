'use client';

import Link from 'next/link';
import { useSession } from './client-auth';

export default function HeaderClient() {
  const uid = useSession();

  // Logged-out header
  if (!uid) {
    return (
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold">Job Quest</Link>
          <a href="/login" className="text-sm underline">Sign in</a>
        </div>
      </header>
    );
  }

  // Logged-in header
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/app" className="font-semibold">Job Quest</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/app" className="hover:underline">Feed</Link>
          <Link href="/app/me" className="hover:underline">My work</Link>
          <a href="/logout" className="text-gray-500 hover:underline">Log out</a>
        </nav>
      </div>
    </header>
  );
}
