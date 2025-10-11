'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useSession } from '../../client-auth';
import { useParams, useRouter } from 'next/navigation';

export default function QuestDetail() {
  const { id } = useParams<{id:string}>();
  const uid = useSession();
  const router = useRouter();
  const [quest, setQuest] = useState<any>(null);

  useEffect(() => {
    supabase.from('quests').select('*').eq('id', id).single().then(({ data, error })=>{
      if(error) alert(error.message); else setQuest(data);
    });
  }, [id]);

  const startQuest = async () => {
    if(!uid) return router.push('/login');
    const { data, error } = await supabase.from('assignments')
      .insert({ user_id: uid, quest_id: String(id), status: 'assigned' })
      .select('id').single();
    if (error) alert(error.message);
    else router.push(`/app/submit?assignment=${data.id}`);
  };

  if(!quest) return <p>Loading…</p>;
  return (
    <div className="prose max-w-none">
      <h1>{quest.title}</h1>
      <p><b>Tier:</b> {quest.tier} • <b>ETA:</b> {quest.est_minutes ?? 60} min</p>
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{quest.brief_md ?? 'Brief coming soon.'}</pre>
      <div className="mt-6">
        <button onClick={startQuest} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Start this quest</button>
      </div>
    </div>
  );
}
