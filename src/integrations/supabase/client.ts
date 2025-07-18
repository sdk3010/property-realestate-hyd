import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mhkxvbuvpekwmxkkoxur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3h2YnV2cGVrd214a2tveHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjcyNjksImV4cCI6MjA2ODAwMzI2OX0.L0035Rdf9hC-REjPPij6-I3lWOGApGpaDTUAeVEwJws";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});