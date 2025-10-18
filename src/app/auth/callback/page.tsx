'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../ui/toast';

export default function AuthCallback() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<any> | null>(null);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../../lib/supabase');
      supabaseRef.current = createBrowserClient();
      const { error } = await supabaseRef.current.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        toast.push(error.message, 'error');
        router.replace('/login');
      } else {
        toast.push('Signed in!', 'success');
        router.replace('/app');
      }
    })();
  }, [router]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
