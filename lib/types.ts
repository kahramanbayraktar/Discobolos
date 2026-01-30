export interface Player {
  id: string;
  name: string;
  nickname?: string;
  position: "Handler" | "Cutter" | "Hybrid";
  number: number;
  image: string;
  funFact: string;
  yearJoined: number;
  isCaptain?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationUrl?: string;
  type: "practice" | "match" | "social" | "tournament";
  opponent?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: "match-report" | "announcement" | "feature";
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  googlePhotosUrl: string;
  date: string;
  photoCount: number;
  previewImages?: string[];
}

export interface Comment {
  id: string;
  albumId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  experienceLevel: "beginner" | "intermediate" | "advanced" | "competitive";
  message: string;
}
