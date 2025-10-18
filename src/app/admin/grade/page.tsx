'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '../../ui/toast';
import { Spinner } from '../../ui/spinner'; 

type QuestObj = { title: string };
type SubmissionObj = { id: string; link_or_file: string | null };
type Row = { id: string; status: 'assigned'|'submitted'|'graded'; quest_id: string; user_id: string; score: number|null; quests?: QuestObj|QuestObj[]|null; submissions?: SubmissionObj[]|null; };
type RawAssignment = { id: string; status: Row['status']; quest_id: string; user_id: string; score: number|null; quests?: QuestObj|QuestObj[]|null; submissions?: SubmissionObj[]|null; };

function getTitle(q: Row['quests']) { if (!q) return undefined; return Array.isArray(q) ? q[0]?.title : q.title; }

export default function GradeInbox() {
  const toast = useToast();
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // boot
  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../../lib/supabase');
      const sb = createBrowserClient();
      supabaseRef.current = sb;

      const { data: user } = await sb.auth.getUser();
      if (!user.user?.id) { setAllowed(false); setLoading(false); return; }

      // check mentors table
      const { data: mrows, error } = await sb.from('mentors').select('user_id').eq('user_id', user.user.id).maybeSingle();
      if (error) { toast.push(error.message, 'error'); setAllowed(false); setLoading(false); return; }

      setAllowed(!!mrows);
      setLoading(false);
    })();
  }, [toast]);

  const load = useCallback(async () => {
    if (!supabaseRef.current) return;
    setLoading(true);
    const { data, error } = await supabaseRef.current
      .from('assignments')
      .select('id,status,quest_id,user_id,score,quests(title),submissions(id,link_or_file)')
      .eq('status', 'submitted')
      .order('id', { ascending: true });
    if (error) { toast.push(error.message, 'error'); setLoading(false); return; }
    const normalized: Row[] = ((data ?? []) as RawAssignment[]).map(r => ({
      id: r.id, status: r.status, quest_id: r.quest_id, user_id: r.user_id, score: r.score ?? null,
      quests: r.quests ?? null, submissions: r.submissions ?? null,
    }));
    setRows(normalized);
    setLoading(false);
  }, [toast]);

  useEffect(() => { if (allowed) load(); }, [allowed, load]);

  const grade = async (id: string, score: number) => {
    if (!supabaseRef.current) return;
    const { error } = await supabaseRef.current.from('assignments').update({ status: 'graded', score }).eq('id', id);
    if (error) return toast.push(error.message, 'error');
    toast.push('Graded ✓', 'success');
    await load();
  };

  if (loading) return <div className="mt-10 text-center"><Spinner label="Loading…" /></div>;
  if (allowed === false) return <p className="mt-10 text-center">Mentor access only.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Needs review</h1>
      {rows.length === 0 && <p>Nothing to grade. Ask a tester to submit.</p>}

      <ul className="space-y-4">
        {rows.map(r => (
          <li key={r.id} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-500">{getTitle(r.quests) ?? r.quest_id}</div>
            <div className="text-gray-700 mb-2">Assignment: {r.id}</div>
            <div className="mb-3">
              {r.submissions && r.submissions.length > 0 ? (
                <a className="underline text-blue-600" target="_blank" href={r.submissions[0].link_or_file ?? '#'}>
                  View submission
                </a>
              ) :<span className="text-gray-400 italic">No submission link</span>}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Score (1–5):</label>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => grade(r.id, n)} className="px-3 py-1 rounded border hover:bg-gray-50">{n}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
