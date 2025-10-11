'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ⬇️ relative path to supabase client
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Finalize the session from the magic-link URL
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        alert(error.message);
        router.replace('/login');
      } else {
        router.replace('/app');
      }
    })();
  }, [router]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
