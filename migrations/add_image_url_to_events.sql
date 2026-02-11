-- 1. Add image_url column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Update existing events with placeholder images
UPDATE events SET image_url = '/events/practice-1.jpg' WHERE type = 'practice' AND image_url IS NULL;
UPDATE events SET image_url = '/events/match-1.jpg' WHERE type = 'match' AND image_url IS NULL;
UPDATE events SET image_url = '/events/social-1.jpg' WHERE type = 'social' AND image_url IS NULL;
UPDATE events SET image_url = '/events/tournament-1.jpg' WHERE type = 'tournament' AND image_url IS NULL;

-- 3. Storage Bucket Setup (Manually create 'events' bucket in Supabase Dashboard)
-- After creating the bucket, you can run these policies:

-- Allow public read access to event images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);

-- Policy for public read access
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'events' );

-- Policy for authenticated upload (admin)
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'events' AND auth.role() = 'authenticated' );

