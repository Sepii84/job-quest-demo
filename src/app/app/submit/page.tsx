'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserClient } from '../../lib/supabase';
import { useSession } from '../client-auth';

export default function Submit() {
  const supabase = createBrowserClient();
  const uid = useSession();
  const sp = useSearchParams();
  const router = useRouter();
  const assignment = sp.get('assignment') ?? '';

  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return router.push('/login');
    if (!assignment) return alert('Missing assignment id in the URL.');
    setLoading(true);

    const { error: subErr } = await supabase.from('submissions').insert({
      assignment_id: assignment,
      link_or_file: url,
      notes,
    });
    if (subErr) {
      setLoading(false);
      return alert(subErr.message);
    }

    const { error: updErr } = await supabase.from('assignments').update({ status: 'submitted' }).eq('id', assignment);
    setLoading(false);

    if (updErr) return alert('Submitted, but failed to flag as submitted: ' + updErr.message);

    alert('Submitted! Your work is now in the review queue.');
    router.push('/app');
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Submit your work</h1>
      <input className="w-full border p-3 rounded-lg" placeholder="Paste link (GitHub, Drive, etc.)" value={url} onChange={(e)=>setUrl(e.target.value)} required />
      <textarea className="w-full border p-3 rounded-lg" rows={5} placeholder="Notes (optional)" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg disabled:opacity-50" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  );
}
