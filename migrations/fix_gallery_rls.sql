-- Fix RLS policies for Gallery and Events tables to allow management via custom auth system
-- Run this in your Supabase SQL Editor

-- 1. GALLERY Table
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.gallery;
DROP POLICY IF EXISTS "Allow public insert access" ON public.gallery;
DROP POLICY IF EXISTS "Allow public update access" ON public.gallery;
DROP POLICY IF EXISTS "Allow public delete access" ON public.gallery;

-- Create public policies
CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.gallery FOR DELETE USING (true);


-- 2. GALLERY_SUBMISSIONS Table
ALTER TABLE public.gallery_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.gallery_submissions;
DROP POLICY IF EXISTS "Allow public insert access" ON public.gallery_submissions;
DROP POLICY IF EXISTS "Allow public update access" ON public.gallery_submissions;
DROP POLICY IF EXISTS "Allow public delete access" ON public.gallery_submissions;

CREATE POLICY "Allow public read access" ON public.gallery_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.gallery_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.gallery_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.gallery_submissions FOR DELETE USING (true);


-- 3. EVENTS Table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.events;
DROP POLICY IF EXISTS "Allow public insert access" ON public.events;
DROP POLICY IF EXISTS "Allow public update access" ON public.events;
DROP POLICY IF EXISTS "Allow public delete access" ON public.events;

CREATE POLICY "Allow public read access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.events FOR DELETE USING (true);


-- 4. RSVPS Table
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public insert access" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public update access" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public delete access" ON public.rsvps;

CREATE POLICY "Allow public read access" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.rsvps FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.rsvps FOR DELETE USING (true);


-- 5. PLAYERS Table
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.players;
DROP POLICY IF EXISTS "Allow public insert access" ON public.players;
DROP POLICY IF EXISTS "Allow public update access" ON public.players;
DROP POLICY IF EXISTS "Allow public delete access" ON public.players;

CREATE POLICY "Allow public read access" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.players FOR DELETE USING (true);
