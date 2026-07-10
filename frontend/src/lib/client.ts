import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
     "https://grvldsfxztrnotsoivnj.supabase.co",
     "sb_publishable_VoGc4xKcYZ3TLtCQVDIpUg_xFFF0kvH"
  );
}
