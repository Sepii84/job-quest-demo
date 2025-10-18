'use client';

import Link from 'next/link';
import { useSession } from './app/client-auth';

export default function Home() {
  const uid = useSession(); // if logged in, show “Go to app”

  return (
    <main className="min-h-[70vh] flex items-center">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Job Quest</h1>

        <p className="text-lg text-gray-300 mb-8">
          Try a job before you choose a job. Pick a short quest, submit your work, and get graded by a mentor.
        </p>

        <div className="flex gap-3">
          {uid ? (
            <Link
              href="/app"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
            >
              Go to app
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
              >
                Sign in
              </Link>
              <Link
                href="/app"
                className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Try the app
              </Link>
            </>
          )}
        </div>

        <div className="mt-10 text-sm text-gray-400">
          MVP build • Next.js + Supabase • Deployed on Vercel
        </div>
      </div>
    </main>
  );
}
