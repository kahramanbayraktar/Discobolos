-- 1. Create the 'events' bucket if it doesn't exist (and ensure it's public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop potential conflicting policies to start fresh
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Actions On Events Bucket" ON storage.objects;

-- 3. Create a single, permissive policy for the 'events' bucket
-- This allows SELECT, INSERT, UPDATE, DELETE for everyone (public & auth)
-- This is to ensure it works. We can restrict it later.
CREATE POLICY "Allow All Actions On Events Bucket"
ON storage.objects
FOR ALL
USING (bucket_id = 'events')
WITH CHECK (bucket_id = 'events');
