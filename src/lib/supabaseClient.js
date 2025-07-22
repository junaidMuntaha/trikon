import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qatunybfermqxudejcmt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdHVueWJmZXJtcXh1ZGVqY210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTc0ODgsImV4cCI6MjA2ODY5MzQ4OH0.tapjUVuOGHyWi8FVTgxeecKxH6a4xhLtk6iqHkxa7bI'

export const supabase = createClient(supabaseUrl, supabaseKey)
