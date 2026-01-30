import { createClient } from '@supabase/supabase-js';
import { Event, GalleryAlbum, GallerySubmission, Player } from './types';

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

// --- Players (Roster) Functions ---

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    nickname: row.nickname || '',
    number: row.number,
    position: row.position,
    image: row.image,
    funFact: row.fun_fact || '',
    yearJoined: row.year_joined,
    isCaptain: row.is_captain,
  }));
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    nickname: data.nickname || '',
    number: data.number,
    position: data.position,
    image: data.image,
    funFact: data.fun_fact || '',
    yearJoined: data.year_joined,
    isCaptain: data.is_captain,
  };
}

export async function createPlayer(player: Omit<Player, 'id'>) {
  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: player.name,
      nickname: player.nickname,
      number: player.number,
      position: player.position,
      image: player.image,
      fun_fact: player.funFact,
      year_joined: player.yearJoined,
      is_captain: player.isCaptain
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updatePlayer(id: string, player: Partial<Omit<Player, 'id'>>) {
  const { data, error } = await supabase
    .from('players')
    .update({
      name: player.name,
      nickname: player.nickname,
      number: player.number,
      position: player.position,
      image: player.image,
      fun_fact: player.funFact,
      year_joined: player.yearJoined,
      is_captain: player.isCaptain
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deletePlayer(id: string) {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
// --- Gallery Functions ---

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching gallery albums:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    coverImage: row.cover_image,
    googlePhotosUrl: row.google_photos_url,
    date: row.date,
    photoCount: row.photo_count || 0,
    previewImages: row.preview_images || [],
  }));
}

export async function getGalleryAlbumById(id: string): Promise<GalleryAlbum | null> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    coverImage: data.cover_image,
    googlePhotosUrl: data.google_photos_url,
    date: data.date,
    photoCount: data.photo_count || 0,
    previewImages: data.preview_images || [],
  };
}

export async function createGalleryAlbum(album: Omit<GalleryAlbum, 'id'>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([{
      title: album.title,
      description: album.description,
      cover_image: album.coverImage,
      google_photos_url: album.googlePhotosUrl,
      date: album.date,
      photo_count: album.photoCount,
      preview_images: album.previewImages || []
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateGalleryAlbum(id: string, album: Partial<Omit<GalleryAlbum, 'id'>>) {
  const { data, error } = await supabase
    .from('gallery')
    .update({
      title: album.title,
      description: album.description,
      cover_image: album.coverImage,
      google_photos_url: album.googlePhotosUrl,
      date: album.date,
      photo_count: album.photoCount,
      preview_images: album.previewImages
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteGalleryAlbum(id: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// --- Gallery Submissions Functions ---

export async function getGallerySubmissions(albumId?: string): Promise<GallerySubmission[]> {
  let query = supabase.from('gallery_submissions').select('*').order('created_at', { ascending: false });
  
  if (albumId) {
    query = query.eq('album_id', albumId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gallery submissions:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    albumId: row.album_id,
    url: row.url,
    filePath: row.file_path,
    authorName: row.author_name,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function createGallerySubmission(submission: Omit<GallerySubmission, 'id' | 'createdAt' | 'status'>) {
  const { data, error } = await supabase
    .from('gallery_submissions')
    .insert([{
      album_id: submission.albumId,
      url: submission.url,
      file_path: submission.filePath,
      author_name: submission.authorName,
      status: 'pending'
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateGallerySubmissionStatus(id: string, status: "approved" | "rejected") {
  const { error } = await supabase
    .from('gallery_submissions')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}
