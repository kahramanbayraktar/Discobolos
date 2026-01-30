
import { createClient } from '@supabase/supabase-js';

function clean(str: string | undefined) {
  if (!str) return undefined;
  return str.replace(/^['"]|['"]$/g, '').trim();
}

const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing environment variables!')
  process.exit(1)
}

try {
  const supabase = createClient(supabaseUrl, supabaseKey)
  console.log('Testing connection to Supabase...')

  async function testConnection() {
    const { data, error } = await supabase.from('events').select('*').limit(1)
    if (error) {
      console.error('Query error:', error.message)
      if (error.code === '42P01') {
        console.log('Wait! The table "events" does not exist yet. You need to run the SQL in Supabase SQL Editor.')
      }
    } else {
      console.log('✅ Connection OK! Successfully accessed "events" table.')
      console.log('Current rows:', data?.length)
    }
  }
  testConnection()
} catch (e: any) {
  console.error('Client Error:', e.message)
}
