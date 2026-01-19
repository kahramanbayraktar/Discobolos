# Discobolos Ultimate Frisbee Team Website - Project Blueprint

## Project Overview
This project is a dynamic, high-performance website for the "Discobolos" Ultimate Frisbee team. It aims to serve players, recruits, and fans with event management, media galleries, and team information.

## Tech Stack
*   **Frontend Framework:** Next.js 14+ (App Router)
    *   *Justification:* Provides Server-Side Rendering (SSR) and Static Site Generation (SSG) for excellent SEO and initial load performance (Core Web Vitals). Strong typing with TypeScript.
*   **Styling:** Tailwind CSS
    *   *Justification:* Utility-first approach allowing rapid development and easy customization for a "Premium" and "Energetic" design.
    *   **Animation:** Framer Motion for smooth, dynamic interactions.
*   **Language:** TypeScript
    *   *Justification:* Ensures type safety and maintainability.
*   **Backend & Auth:** Supabase (BaaS)
    *   *Justification:* Provides a PostgreSQL database, Authentication, and Real-time capabilities out of the box. Used for Event Management and Comment systems.
*   **Media:** Google Photos API Integration
    *   *Justification:* Avoids high bandwidth costs for hosting videos/images. Leveraging Google Photos albums allows admins to easily manage media without a complex CMS.

## Directory Structure
```
/web
  ├── .env.local             # Environment variables (Supabase keys, Google API keys)
  ├── app
  │   ├── layout.tsx         # Root layout (Fonts, SEO, Global styles)
  │   ├── page.tsx           # Home Page (Hero, Teasers)
  │   ├── events
  │   │   └── page.tsx       # Calendar/Event List
  │   ├── roster
  │   │   └── page.tsx       # Team Profiles
  │   ├── news
  │   │   └── page.tsx       # Blog/Announcements
  │   ├── gallery
  │   │   └── page.tsx       # Photo/Video Gallery (Google Photos)
  │   ├── contact
  │   │   └── page.tsx       # Recruitment/Contact Form
  │   └── globals.css        # Global Tailwind imports & custom vars
  ├── components
  │   ├── ui                 # Primitive UI components (Buttons, Inputs)
  │   ├── layout             # Navbar, Footer
  │   ├── events             # EventCard, EventCalendar
  │   └── gallery            # AlbumGrid, PhotoViewer
  ├── lib
  │   ├── supabase.ts        # Supabase Client configuration
  │   ├── google-photos.ts   # Google Photos API helpers
  │   ├── utils.ts           # Classnames merging util
  │   └── constants.ts       # Site content constants
  ├── types
  │   └── index.ts           # Global interfaces (Event, Player, etc.)
  └── public                 # Static assets (Favicons, Logos)
```

## Core Features & Implementation Details

### 1. Event Management
*   **Data Model:** `events` table in Supabase.
*   **Fields:** `id`, `title`, `date`, `location`, `type` (Practice/Match), `description`.
*   **Frontend:** Renders a list of upcoming events sorted by date.

### 2. Media Gallery (Google Photos)
*   **Integration:** 
    *   Admin provides a Shared Album Link.
    *   System uses Google Photos Library API to fetch media items from the album.
    *   **Alternative (Simpler):** If API is too complex for MVP, embed the album or use a public scraper/RSS feed approach, but API is preferred for "Premium" feel.
*   **Comments:** `comments` table in Supabase linked to `media_id` (or album ID).

### 3. Recruitment Form
*   **Form:** Controlled React component.
*   **Submission:** Writes to `recruits` table in Supabase or triggers an Email (via Resend/emailjs).

## Design System
*   **Colors:** Extracted from Jersey (Primary: TBD, Secondary: TBD). High contrast, energetic.
*   **Typography:** Modern Sans-Serif (e.g., 'Inter' or 'Outfit').
*   **Vibe:** Glassmorphism, subtle gradients, focus on action shots.

## Setup Instructions
1.  Navigate to `web` directory.
2.  `npm install`
3.  Create `.env.local` with:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `GOOGLE_PHOTOS_CLIENT_ID` (if implementing full flow)
4.  `npm run dev`
