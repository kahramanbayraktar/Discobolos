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

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    date: data.date,
    time: data.time,
    endTime: data.end_time || undefined,
    location: data.location,
    locationUrl: data.location_url || undefined,
    type: data.type,
    opponent: data.opponent || undefined,
  };
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

  if (error) throw error;
  return data[0];
}

export async function updateEvent(id: string, event: Partial<Omit<Event, 'id'>>) {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      end_time: event.endTime,
      location: event.location,
      location_url: event.locationUrl,
      type: event.type,
      opponent: event.opponent
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
