
import { createClient } from '@supabase/supabase-js'
import { events } from '../lib/data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedEvents() {
  console.log('Seeding events to Supabase...')

  // Map camelCase to snake_case for DB
  const dbEvents = events.map(event => ({
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    end_time: event.endTime,
    location: event.location,
    location_url: event.locationUrl,
    type: event.type,
    opponent: event.opponent
  }))

  const { data, error } = await supabase
    .from('events')
    .insert(dbEvents)
    .select()

  if (error) {
    console.error('Error seeding events:', error.message)
    process.exit(1)
  }

  console.log('✅ Successfully seeded', data.length, 'events!')
}

seedEvents()
