'use client';                 // ✅ mark this module as client-only
import 'client-only';         // ✅ hard-stop if something tries to import on the server

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// re-use a single browser client instance
let client: SupabaseClient | null = null;

/**
 * Create (or reuse) a Supabase client in the BROWSER.
 * Call this only from 'use client' components.
 */
export function createBrowserClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}
