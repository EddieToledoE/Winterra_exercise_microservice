import { ExerciseSession } from '../entities/user-exercise';

export interface ExerciseSessionRepository {
  create(session: Omit<ExerciseSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseSession>;
  findById(id: string): Promise<ExerciseSession | null>;
  findByUserId(userId: string, page?: number, limit?: number): Promise<{
    sessions: ExerciseSession[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  update(id: string, session: Partial<ExerciseSession>): Promise<ExerciseSession | null>;
  delete(id: string): Promise<boolean>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ExerciseSession[]>;
  getSessionStats(userId: string): Promise<{
    totalSessions: number;
    totalDuration: number;
    totalSets: number;
    mostUsedMuscleGroups: Array<{ muscleGroup: string; count: number }>;
  }>;
  getWeeklyMuscleGroupSummary(userId: string, startDate: Date, endDate: Date): Promise<{
    userId: string;
    start: string;
    end: string;
    setsByMuscleGroup: Record<string, number>;
  }>;
} 