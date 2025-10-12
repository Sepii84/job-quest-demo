'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from './client-auth';

type Quest = { id: string; title: string; est_minutes: number | null; track: string; tier: string };

export default function Feed() {
  const uid = useSession();
  const supabaseRef = useRef<ReturnType<any> | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../lib/supabase');
      supabaseRef.current = createBrowserClient();
      const { data, error } = await supabaseRef.current.from('quests').select('*').eq('status','active');
      if (error) alert(error.message); else setQuests((data ?? []) as Quest[]);
    })();
  }, []);

  if (!uid) {
    return <p className="mt-20 text-center">Please <a className="text-blue-600 underline" href="/login">log in</a>.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your quests</h2>
        <a href="/app/me" className="text-blue-600 underline">My work</a>
      </div>

      <ul className="grid md:grid-cols-2 gap-4">
        {quests.map(q => (
          <li key={q.id} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">{q.track} • {q.tier}</div>
            <h3 className="text-xl font-medium">{q.title}</h3>
            <div className="text-gray-600 mb-3">ETA {q.est_minutes ?? 60} min</div>
            <Link className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg" href={`/app/quests/${q.id}`}>View brief</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
