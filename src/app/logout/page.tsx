'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef } from 'react';

export default function Logout() {
  const supabaseRef = useRef<ReturnType<any> | null>(null);

  useEffect(() => {
    (async () => {
      const { createBrowserClient } = await import('../lib/supabase');
      supabaseRef.current = createBrowserClient();
      try { await supabaseRef.current.auth.signOut(); }
      finally { window.location.href = '/'; }
    })();
  }, []);

  return <p className="text-center mt-10">Signing out…</p>;
}
