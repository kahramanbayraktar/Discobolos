-- Re-create gallery_comments table with author_id for ownership checks
-- Run this in your Supabase SQL Editor

DROP TABLE IF EXISTS public.gallery_comments;

CREATE TABLE public.gallery_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    album_id UUID NOT NULL REFERENCES public.gallery(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.players(id) ON DELETE SET NULL, -- Link to player
    author_name TEXT NOT NULL, -- Fallback or cached name
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.gallery_comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.gallery_comments
    FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON public.gallery_comments
    FOR INSERT WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access" ON public.gallery_comments
    FOR UPDATE USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access" ON public.gallery_comments
    FOR DELETE USING (true);
