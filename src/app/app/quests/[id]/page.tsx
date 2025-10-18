'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import { useSession } from '../../client-auth';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '../../../ui/toast';

type Quest = {
  id: string;
  title: string;
  tier: string;
  est_minutes: number | null;
  brief_md: string | null;
  assets_url: string | null;
};

export default function QuestDetail() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const uid = useSession();
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<any> | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../../../lib/supabase');
      supabaseRef.current = createBrowserClient();
      const { data, error } = await supabaseRef.current.from('quests').select('*').eq('id', id).single();
      if (error) toast.push(error.message, 'error'); else setQuest(data as Quest);
    })();
  }, [id]);

  const startQuest = async () => {
    if (!uid) return router.push('/login');
    if (!supabaseRef.current) return;
    const { data, error } = await supabaseRef.current
      .from('assignments')
      .insert({ user_id: uid, quest_id: String(id), status: 'assigned' })
      .select('id')
      .single();
    if (error) toast.push(error.message, 'error');
    else router.push(`/app/submit?assignment=${data.id}`);
  };

  if (!quest) return <p>Loading…</p>;

  return (
    <div className="prose max-w-none">
      <h1>{quest.title}</h1>
      <p><b>Tier:</b> {quest.tier} • <b>ETA:</b> {quest.est_minutes ?? 60} min</p>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{quest.brief_md ?? 'Brief coming soon.'}</pre>
      {quest.assets_url && <a className="inline-block mt-3 underline" href={quest.assets_url} target="_blank">Download assets</a>}
      <div className="mt-6">
        <button onClick={startQuest} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Start this quest</button>
      </div>
    </div>
  );
}
