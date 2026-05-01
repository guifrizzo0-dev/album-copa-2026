import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bkffgsjizgfsvphlvvcg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_uWapMJJAOrp0njSZy90GBw_Q4PQocTN'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)