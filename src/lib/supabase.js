import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Bulletproof validation to prevent entire application module load-crash
try {
    if (supabaseUrl && supabaseUrl.startsWith('https://') && supabaseAnonKey && supabaseAnonKey.length > 20) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log("Supabase Client initialized successfully.");
    } else {
        console.warn("Supabase credentials missing or invalid format. Using local fallback datasets.");
        // Create a dummy client so we don't hit undefined calls, and let it safely error/catch in hooks
        supabase = createClient('https://placeholder.supabase.co', 'placeholder');
    }
} catch (error) {
    console.error("Supabase Initialization Error:", error);
    // Guarantee a client reference so .from() calls don't crash
    supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export { supabase };
