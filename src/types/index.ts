export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  duration_minutes?: number;
  subject: string;
  created_at: string;
  updated_at: string;
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  last_reviewed?: string;
  review_count: number;
  mastered: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyStats {
  tasksCompleted: number;
  totalTasks: number;
  weeklyStreak: number;
  favoriteSubject: string;
  totalStudyTime: number;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;