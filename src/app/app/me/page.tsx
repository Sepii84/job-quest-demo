'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '../../lib/supabase';
import Link from 'next/link';

type QuestObj = { title: string };
type Row = {
  id: string;
  status: 'assigned'|'submitted'|'graded';
  score: number|null;
  quests?: QuestObj | QuestObj[] | null;
};

type RawRow = {
  id: string;
  status: Row['status'];
  score: number | null;
  quests?: QuestObj | QuestObj[] | null;
};

function getTitle(q: Row['quests']) {
  if (!q) return undefined;
  return Array.isArray(q) ? q[0]?.title : q.title;
}

export default function MyWork() {
  const supabase = createBrowserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data, error } = await supabase
        .from('assignments')
        .select('id,status,score,quests(title)')
        .eq('user_id', user.user.id)
        .order('assigned_at', { ascending: false });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const normalized: Row[] = ((data ?? []) as RawRow[]).map((r) => ({
        id: r.id,
        status: r.status,
        score: r.score ?? null,
        quests: r.quests ?? null,
      }));

      setRows(normalized);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <p className="mt-10 text-center">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My work</h1>
        <a href="/logout" className="text-sm text-gray-500 underline">Log out</a>
      </div>

      {rows.length === 0 && (
        <p>No assignments yet. <Link className="text-blue-600 underline" href="/app">Pick a quest</Link>.</p>
      )}

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="border rounded-xl p-4 bg-white">
            <div className="font-medium">{getTitle(r.quests) ?? 'Quest'}</div>
            <div className="text-sm text-gray-600">Status: {r.status}</div>
            {r.score != null && <div className="text-sm">Score: {r.score}/5</div>}
            <div className="text-xs text-gray-500">Assignment: {r.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
