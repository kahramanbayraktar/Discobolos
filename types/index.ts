export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  location: string;
  type: 'practice' | 'match' | 'social';
  description?: string;
  map_url?: string;
}

export interface Player {
  id: string;
  name: string;
  number?: number;
  position: 'handler' | 'cutter' | 'hybrid' | 'coach';
  image_url: string;
  fun_fact?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  published_at: string;
  cover_image?: string;
}

export interface GoogleAlbum {
  id: string;
  title: string;
  cover_photo_url: string;
  product_url: string;
  mediaItemsCount: number;
}
