import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zmsufeomlvxnteacectv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc3VmZW9tbHZ4bnRlYWNlY3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjQzNTMsImV4cCI6MjA3MjQ0MDM1M30.58gatBL99nrTIIcKMgzBEYJwI7q7lW8vQAsi91IeLCw"; // process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey!);
