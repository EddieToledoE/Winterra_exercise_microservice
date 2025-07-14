import { ExerciseSession, SessionSummary } from '../entities/exercise-session';

export interface SessionRepository {
  // Operaciones básicas CRUD
  create(session: Omit<ExerciseSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseSession>;
  findById(id: string): Promise<ExerciseSession | null>;
  update(id: string, session: Partial<ExerciseSession>): Promise<ExerciseSession | null>;
  delete(id: string): Promise<boolean>;

  // Búsquedas por usuario
  findByUserId(userId: string): Promise<ExerciseSession[]>;
  findUserSessionsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ExerciseSession[]>;
  
  // Búsquedas por fecha
  findByDateRange(startDate: Date, endDate: Date): Promise<ExerciseSession[]>;
  findByDate(date: Date): Promise<ExerciseSession[]>;

  // Paginación para usuario
  findUserSessionsWithPagination(
    userId: string, 
    page: number, 
    limit: number
  ): Promise<{
    sessions: ExerciseSession[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // Resúmenes y estadísticas
  getSessionSummary(sessionId: string): Promise<SessionSummary | null>;
  getUserSessionStats(userId: string, period: 'week' | 'month' | 'year'): Promise<{
    totalSessions: number;
    totalDuration: number;
    totalSets: number;
    averageSessionDuration: number;
    mostFrequentExercises: Array<{ exerciseId: string; count: number }>;
  }>;

  // Análisis de progreso
  getUserProgress(userId: string, exerciseId: string, period: 'week' | 'month' | 'year'): Promise<{
    exerciseId: string;
    totalSets: number;
    averageWeight: number;
    maxWeight: number;
    totalVolume: number;
    sessions: number;
  }>;

  // Búsqueda avanzada
  searchUserSessions(userId: string, query: string): Promise<ExerciseSession[]>;
  
  // Sesiones recientes
  getRecentSessions(userId: string, limit: number): Promise<ExerciseSession[]>;
  
  // Sesiones por ejercicio
  getSessionsByExercise(userId: string, exerciseId: string): Promise<ExerciseSession[]>;
} 