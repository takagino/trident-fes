import { createClient } from '@supabase/supabase-js';

// Viteの環境変数からURLとキーを読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
