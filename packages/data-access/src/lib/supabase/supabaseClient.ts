// packages/data-access/src/lib/supabase/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[Supabase Client] Keys are not set in .env.local!');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export { supabase };