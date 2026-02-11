import { NewsPost } from "./types";

// This file is currently only used for News Posts as they are not yet migrated to Supabase.
// Players, Events, and Gallery are fetched from Supabase.

export const newsPosts: NewsPost[] = [
  {
    id: "1",
    title: "Discobolos Wins Spirit Award at Beach Classic",
    slug: "discobolos-wins-spirit-award-beach-classic",
    excerpt: "The team showed incredible spirit and sportsmanship throughout the two-day tournament, earning the highest votes from opponents.",
    content: "Full report coming soon...",
    date: "2024-05-15",
    author: "Cem",
    category: "match-report",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "New Training Schedule for Summer Season",
    slug: "new-training-schedule-summer-season",
    excerpt: "We're moving our weekday practices to Camel Beach to make the most of the evening sun. Check the updated calendar for details.",
    content: "Full report coming soon...",
    date: "2024-06-01",
    author: "Deniz",
    category: "announcement",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Spotlight: Exploring the History of Ultimate in Bodrum",
    slug: "history-of-ultimate-in-bodrum",
    excerpt: "How a small group of friends turned a hobby into a thriving community that thrives on the Aegean coast.",
    content: "Full report coming soon...",
    date: "2024-06-10",
    author: "Ali",
    category: "feature",
    image: "https://images.unsplash.com/photo-1544698116-e9c9f319b2bc?q=80&w=2000&auto=format&fit=crop",
  },
];
