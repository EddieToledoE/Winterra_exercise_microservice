import { UserExercise } from '../entities/user-exercise';

export interface UserExerciseRepository {
  // Operaciones básicas CRUD
  create(exercise: Omit<UserExercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserExercise>;
  findById(id: string): Promise<UserExercise | null>;
  findByUserId(userId: string): Promise<UserExercise[]>;
  update(id: string, exercise: Partial<UserExercise>): Promise<UserExercise | null>;
  delete(id: string): Promise<boolean>;

  // Búsquedas específicas
  findByName(userId: string, name: string): Promise<UserExercise[]>;
  searchByText(userId: string, query: string): Promise<UserExercise[]>;

  // Paginación
  findWithPagination(userId: string, page: number, limit: number): Promise<{
    exercises: UserExercise[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // Estadísticas
  getUserExerciseStats(userId: string): Promise<{
    total: number;
    mostUsed: Array<{ name: string; count: number }>;
    totalSets: number;
  }>;
} 