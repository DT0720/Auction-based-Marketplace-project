import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseUrl = "https://pljhkbimqoafgzrjwioq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsamhrYmltcW9hZmd6cmp3aW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNDc3MDIsImV4cCI6MjA0NzYyMzcwMn0.JXimo2Dlju0iiagNVee9bc5EA0ZVVFWx8Njtl_3op80";

export const supabase = createClient(supabaseUrl, supabaseKey);