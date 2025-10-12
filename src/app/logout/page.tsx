'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { createBrowserClient } from '../lib/supabase';

export default function Logout() {
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        // send them home either way
        window.location.href = '/';
      }
    })();
  }, [supabase]);

  return <p className="text-center mt-10">Signing out…</p>;
}
