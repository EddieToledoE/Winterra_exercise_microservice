import { Exercise, ExerciseCategory, MuscleGroup, ExerciseDifficulty } from '../entities/exercise';

export interface ExerciseRepository {
  // Operaciones básicas CRUD
  create(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise>;
  findById(id: string): Promise<Exercise | null>;
  findAll(): Promise<Exercise[]>;
  update(id: string, exercise: Partial<Exercise>): Promise<Exercise | null>;
  delete(id: string): Promise<boolean>;

  // Búsquedas específicas
  findByCategory(category: ExerciseCategory): Promise<Exercise[]>;
  findByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]>;
  findByDifficulty(difficulty: ExerciseDifficulty): Promise<Exercise[]>;
  findByName(name: string): Promise<Exercise[]>;
  
  // Búsquedas combinadas
  findByFilters(filters: {
    category?: ExerciseCategory;
    muscleGroups?: MuscleGroup[];
    difficulty?: ExerciseDifficulty;
    name?: string;
  }): Promise<Exercise[]>;

  // Búsqueda por texto
  searchByText(query: string): Promise<Exercise[]>;

  // Paginación
  findWithPagination(page: number, limit: number): Promise<{
    exercises: Exercise[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  // Estadísticas
  getExerciseStats(): Promise<{
    total: number;
    byCategory: Record<ExerciseCategory, number>;
    byDifficulty: Record<ExerciseDifficulty, number>;
  }>;
} 