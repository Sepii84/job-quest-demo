'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '../lib/supabase';

export default function Login() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace('/app');
    })();
  }, [router, supabase]);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${base}/auth/callback` },
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  if (sent) {
    return <p className="max-w-md mx-auto mt-10 text-center">Check your email for the magic link.</p>;
  }

  return (
    <form onSubmit={sendMagicLink} className="max-w-md mx-auto space-y-4 mt-10">
      <h2 className="text-2xl font-semibold">Sign in</h2>
      <input
        className="w-full border rounded-lg p-3"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send magic link</button>
    </form>
  );
}
