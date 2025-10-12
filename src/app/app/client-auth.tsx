'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useSession() {
  const supabaseRef = useRef<ReturnType<any> | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const { createBrowserClient } = await import('../lib/supabase');
      const supabase = createBrowserClient();
      supabaseRef.current = supabase;

      // set initial user
      const { data } = await supabase.auth.getUser();
      setUid(data.user?.id ?? null);

      // subscribe to auth changes (typed)
      const { data: listener } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          setUid(session?.user?.id ?? null);
        }
      );
      unsubscribe = () => listener.subscription.unsubscribe();
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return uid;
}
