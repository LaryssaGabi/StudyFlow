/*
  # Create study tasks table

  1. New Tables
    - `study_tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `day_of_week` (integer, required - 0=Sunday, 1=Monday, etc.)
      - `priority` (text, required - low/medium/high)
      - `completed` (boolean, default false)
      - `duration_minutes` (integer, optional)
      - `subject` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `study_tasks` table
    - Add policies for public read access and authenticated user modifications
*/

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed boolean NOT NULL DEFAULT false,
  duration_minutes integer CHECK (duration_minutes > 0),
  subject text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for study_tasks
CREATE POLICY "Enable read access for all users" 
  ON public.study_tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users" 
  ON public.study_tasks 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" 
  ON public.study_tasks 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" 
  ON public.study_tasks 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_study_tasks_day_of_week ON public.study_tasks(day_of_week);
CREATE INDEX IF NOT EXISTS idx_study_tasks_subject ON public.study_tasks(subject);
CREATE INDEX IF NOT EXISTS idx_study_tasks_completed ON public.study_tasks(completed);