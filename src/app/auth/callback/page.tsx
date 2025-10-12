'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        alert(error.message);
        router.replace('/login');
      } else {
        router.replace('/app');
      }
    })();
  }, [router, supabase]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
