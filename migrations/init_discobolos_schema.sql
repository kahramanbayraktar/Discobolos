-- Execute this script in your Supabase SQL Editor
-- This will create the necessary tables in the "discobolos" schema.

CREATE SCHEMA IF NOT EXISTS discobolos;
SET search_path TO discobolos;

-- 1. PLAYERS
CREATE TABLE IF NOT EXISTS discobolos.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  position TEXT,
  number INTEGER,
  image TEXT,
  fun_fact TEXT,
  year_joined INTEGER,
  is_captain BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  email TEXT UNIQUE,
  access_code TEXT,
  card_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENTS
CREATE TABLE IF NOT EXISTS discobolos.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME,
  location TEXT NOT NULL,
  location_url TEXT,
  type TEXT CHECK (type IN ('practice', 'match', 'social', 'tournament')),
  opponent TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GALLERY
CREATE TABLE IF NOT EXISTS discobolos.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  google_photos_url TEXT,
  date DATE NOT NULL,
  photo_count INTEGER DEFAULT 0,
  preview_images JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GALLERY COMMENTS
CREATE TABLE IF NOT EXISTS discobolos.gallery_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES discobolos.gallery(id) ON DELETE CASCADE,
  author_id UUID REFERENCES discobolos.players(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- 5. GALLERY SUBMISSIONS
CREATE TABLE IF NOT EXISTS discobolos.gallery_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES discobolos.gallery(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  author_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE
CREATE TABLE IF NOT EXISTS discobolos.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES discobolos.players(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES discobolos.events(id) ON DELETE CASCADE,
    is_present BOOLEAN DEFAULT FALSE,
    is_early BOOLEAN DEFAULT FALSE,
    is_on_time BOOLEAN DEFAULT FALSE,
    has_double_jersey BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, event_id)
);

-- 7. RSVPS
CREATE TABLE IF NOT EXISTS discobolos.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES discobolos.players(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES discobolos.events(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('coming', 'not_coming', 'maybe')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, event_id)
);

-- ENABLE RLS & PERMISSIVE POLICIES

ALTER TABLE discobolos.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on players" ON discobolos.players FOR ALL USING (true);

ALTER TABLE discobolos.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on events" ON discobolos.events FOR ALL USING (true);

ALTER TABLE discobolos.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on gallery" ON discobolos.gallery FOR ALL USING (true);

ALTER TABLE discobolos.gallery_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on gallery_comments" ON discobolos.gallery_comments FOR ALL USING (true);

ALTER TABLE discobolos.gallery_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on gallery_submissions" ON discobolos.gallery_submissions FOR ALL USING (true);

ALTER TABLE discobolos.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on attendance" ON discobolos.attendance FOR ALL USING (true);

ALTER TABLE discobolos.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on rsvps" ON discobolos.rsvps FOR ALL USING (true);

-- GRANT SCHEMA USAGE TO SUPABASE ROLES
GRANT USAGE ON SCHEMA discobolos TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA discobolos TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA discobolos TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA discobolos TO anon, authenticated, service_role;
