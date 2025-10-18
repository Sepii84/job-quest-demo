'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from './client-auth';
import { useToast } from '../ui/toast';

type Quest = { id: string; title: string; est_minutes: number | null; track: string; tier: string };

export default function Feed() {
  const toast = useToast();
  const uid = useSession();
  const supabaseRef = useRef<ReturnType<any> | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../lib/supabase');
      supabaseRef.current = createBrowserClient();
      const { data, error } = await supabaseRef.current.from('quests').select('*').eq('status','active');
      if (error) toast.push(error.message, 'error'); else setQuests((data ?? []) as Quest[]);
    })();
  }, []);

  if (!uid) {
    return <p className="mt-20 text-center">Please <a className="text-blue-600 underline" href="/login">log in</a>.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Your quests</h2>

      <ul className="grid md:grid-cols-2 gap-4">
        {quests.map(q => (
          <li key={q.id} className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow transition">
            <div className="text-sm text-gray-500">{q.track} • {q.tier}</div>
            <h3 className="text-xl font-medium">{q.title}</h3>
            <div className="text-gray-600 mb-3">ETA {q.est_minutes ?? 60} min</div>
            <Link className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black" href={`/app/quests/${q.id}`}>View brief</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
