/*
  # Create flash cards table

  1. New Tables
    - `flash_cards`
      - `id` (uuid, primary key)
      - `question` (text, required)
      - `answer` (text, required)
      - `subject` (text, required)
      - `difficulty` (text, required - easy/medium/hard)
      - `last_reviewed` (timestamp, optional)
      - `review_count` (integer, default 0)
      - `mastered` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `flash_cards` table
    - Add policies for public read access and authenticated user modifications
*/

CREATE TABLE IF NOT EXISTS public.flash_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  subject text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  last_reviewed timestamptz,
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  mastered boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.flash_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for flash_cards
CREATE POLICY "Enable read access for all users" 
  ON public.flash_cards 
  FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON public.flash_cards 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" 
  ON public.flash_cards 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" 
  ON public.flash_cards 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flash_cards_subject ON public.flash_cards(subject);
CREATE INDEX IF NOT EXISTS idx_flash_cards_difficulty ON public.flash_cards(difficulty);
CREATE INDEX IF NOT EXISTS idx_flash_cards_mastered ON public.flash_cards(mastered);
CREATE INDEX IF NOT EXISTS idx_flash_cards_last_reviewed ON public.flash_cards(last_reviewed);