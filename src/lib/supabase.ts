/**
 * Supabase Client (Browser)
 * 
 * Single-user mode: No auth, uses a fixed workspace ID from env.
 * For dogfooding/personal use only.
 * 
 * Note: We're not using strict Database typing here because the manually
 * created types don't match Supabase's expected insert/update types.
 * Types are used at the component level for entity shapes.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using placeholders');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Fixed workspace for single-user mode
export const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID || '';
