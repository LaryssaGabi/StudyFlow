import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      study_tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          day_of_week: number;
          priority: 'low' | 'medium' | 'high';
          completed: boolean;
          duration_minutes: number | null;
          subject: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          day_of_week: number;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          duration_minutes?: number | null;
          subject: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          day_of_week?: number;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          duration_minutes?: number | null;
          subject?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      flash_cards: {
        Row: {
          id: string;
          question: string;
          answer: string;
          subject: string;
          difficulty: 'easy' | 'medium' | 'hard';
          last_reviewed: string | null;
          review_count: number;
          mastered: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          subject: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          last_reviewed?: string | null;
          review_count?: number;
          mastered?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          subject?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          last_reviewed?: string | null;
          review_count?: number;
          mastered?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};