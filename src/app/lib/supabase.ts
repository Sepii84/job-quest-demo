import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client in the BROWSER.
 * Call this inside 'use client' components only.
 * We avoid creating the client at import-time so builds/prerender don't require envs.
 */
export function createBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}
