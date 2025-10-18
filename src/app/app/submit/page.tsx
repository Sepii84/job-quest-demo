'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '../client-auth';
import { useToast } from '../../ui/toast';


// ---- Outer page just provides Suspense ----
export default function SubmitPage() {
  return (
    <Suspense fallback={<p className="mt-10 text-center">Loading…</p>}>
      <SubmitInner />
    </Suspense>
  );
}

// ---- Inner client component can safely use useSearchParams ----
function SubmitInner() {
  const uid = useSession();
  const sp = useSearchParams();
  const router = useRouter();
  const assignment = sp.get('assignment') ?? '';
  const toast = useToast();

  const supabaseRef = useRef<SupabaseClient | null>(null);
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../../lib/supabase');
      supabaseRef.current = createBrowserClient();
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return router.push('/login');
    if (!assignment) return alert('Missing assignment id in the URL.');
    if (!supabaseRef.current) return;
    setLoading(true);

    const { error: subErr } = await supabaseRef.current
      .from('submissions')
      .insert({ assignment_id: assignment, link_or_file: url, notes });
    if (subErr) { setLoading(false); return toast.push(subErr.message, 'error'); }

    const { error: updErr } = await supabaseRef.current
      .from('assignments')
      .update({ status: 'submitted' })
      .eq('id', assignment);

    setLoading(false);

    if (updErr) return toast.push('Submitted, but failed to flag as submitted: ' + updErr.message, 'error');

    toast.push('Submitted! Your work is now in the review queue.', 'success');
    router.push('/app');
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Submit your work</h1>
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Paste link (GitHub, Drive, etc.)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-3 rounded-lg"
        rows={5}
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg disabled:opacity-50" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  );
}
