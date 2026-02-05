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
  isAdmin?: boolean;
  email?: string;
  accessCode?: string;
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

export interface GalleryComment {
  id: string;
  albumId: string;
  authorId?: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GallerySubmission {
  id: string;
  albumId: string;
  url: string;
  filePath: string;
  authorName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  playerId: string;
  eventId: string;
  isPresent: boolean;
  isEarly: boolean;
  isOnTime: boolean;
  hasDoubleJersey: boolean;
  notes?: string;
  createdAt: string;
}

export interface PlayerStats extends Player {
  attendanceCount: number;
  earlyArrivalCount: number;
  onTimeCount: number;
  doubleJerseyCount: number;
  totalPoints: number;
  rank?: number;
}

export interface RSVP {
  id: string;
  playerId: string;
  eventId: string;
  status: "coming" | "not_coming" | "maybe";
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  experienceLevel: "beginner" | "intermediate" | "advanced" | "competitive";
  message: string;
}
