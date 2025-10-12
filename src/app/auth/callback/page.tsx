'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<any> | null>(null);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../../lib/supabase');
      supabaseRef.current = createBrowserClient();
      const { error } = await supabaseRef.current.auth.exchangeCodeForSession(window.location.href);
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
