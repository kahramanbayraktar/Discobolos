-- Add card_config column to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS card_config JSONB DEFAULT NULL;
