import { createClient } from '@supabase/supabase-js';
import { Event } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  // Map snake_case from DB to camelCase for the app
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    date: row.date,
    time: row.time,
    endTime: row.end_time || undefined,
    location: row.location,
    locationUrl: row.location_url || undefined,
    type: row.type,
    opponent: row.opponent || undefined,
  }));
}

export async function createEvent(event: Omit<Event, 'id'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      end_time: event.endTime,
      location: event.location,
      location_url: event.locationUrl,
      type: event.type,
      opponent: event.opponent
    }])
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}
