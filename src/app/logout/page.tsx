'use client';
import { supabase } from '../lib/supabase';

export default function Logout() {
  async function doLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
  doLogout();
  return <p className="text-center mt-10">Signing out…</p>;
}
