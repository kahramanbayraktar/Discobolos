-- Update players table to include email for authentication linking
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add email to Player interface in types
-- (I will do this in the code)
