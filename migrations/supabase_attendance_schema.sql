-- Attendance Table for Discobolos
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    is_present BOOLEAN DEFAULT FALSE,
    is_early BOOLEAN DEFAULT FALSE,
    is_on_time BOOLEAN DEFAULT FALSE,
    has_double_jersey BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure only one attendance record per player per event
    UNIQUE(player_id, event_id)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.attendance
    FOR SELECT USING (true);

-- Allow authenticated (admin) upsert access
CREATE POLICY "Allow admin to manage attendance" ON public.attendance
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
