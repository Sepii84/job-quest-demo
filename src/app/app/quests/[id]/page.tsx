'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '../../../lib/supabase';
import { useSession } from '../../client-auth';
import { useParams, useRouter } from 'next/navigation';

type Quest = {
  id: string;
  title: string;
  tier: string;
  est_minutes: number | null;
  brief_md: string | null;
  assets_url: string | null;
};

export default function QuestDetail() {
  const supabase = createBrowserClient();
  const { id } = useParams<{ id: string }>();
  const uid = useSession();
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('quests').select('*').eq('id', id).single();
      if (error) alert(error.message);
      else setQuest(data as Quest);
    })();
  }, [id, supabase]);

  const startQuest = async () => {
    if (!uid) return router.push('/login');
    const { data, error } = await supabase
      .from('assignments')
      .insert({ user_id: uid, quest_id: String(id), status: 'assigned' })
      .select('id')
      .single();
    if (error) alert(error.message);
    else router.push(`/app/submit?assignment=${data.id}`);
  };

  if (!quest) return <p>Loading…</p>;

  return (
    <div className="prose max-w-none">
      <h1>{quest.title}</h1>
      <p><b>Tier:</b> {quest.tier} • <b>ETA:</b> {quest.est_minutes ?? 60} min</p>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{quest.brief_md ?? 'Brief coming soon.'}</pre>
      {quest.assets_url && (
        <a className="inline-block mt-3 underline" href={quest.assets_url} target="_blank">
          Download assets
        </a>
      )}
      <div className="mt-6">
        <button onClick={startQuest} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Start this quest
        </button>
      </div>
    </div>
  );
}
