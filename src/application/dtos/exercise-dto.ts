import { Exercise, ExerciseCategory, MuscleGroup, ExerciseDifficulty } from '../../domain/entities/exercise';

// DTOs para entrada de datos
export interface CreateExerciseDto {
  name: string;
  description?: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  equipment?: string[];
  instructions?: string[];
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string;
  category?: ExerciseCategory;
  muscleGroups?: MuscleGroup[];
  difficulty?: ExerciseDifficulty;
  equipment?: string[];
  instructions?: string[];
}

export interface ExerciseFiltersDto {
  category?: ExerciseCategory;
  muscleGroups?: MuscleGroup[];
  difficulty?: ExerciseDifficulty;
  name?: string;
  page?: number;
  limit?: number;
}

// DTOs para salida de datos
export interface ExerciseResponseDto {
  id: string;
  name: string;
  description: string | undefined;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  equipment: string[] | undefined;
  instructions: string[] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseListResponseDto {
  exercises: ExerciseResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ExerciseStatsDto {
  total: number;
  byCategory: Record<ExerciseCategory, number>;
  byDifficulty: Record<ExerciseDifficulty, number>;
}

// DTOs para recomendaciones
export interface UserProfileDto {
  fitnessLevel: string;
  goals: string[];
  experience: string;
}

export interface ExerciseRecommendationDto {
  exercise: ExerciseResponseDto;
  score: number;
  reason: string;
}

// DTOs para progreso
export interface ExerciseProgressDto {
  exerciseId: string;
  exerciseName: string;
  totalSessions: number;
  totalSets: number;
  averageWeight: number;
  maxWeight: number;
  progress: number;
  lastSession: string | undefined;
}

// Mappers
export class ExerciseMapper {
  static toResponseDto(exercise: Exercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      muscleGroups: exercise.muscleGroups,
      difficulty: exercise.difficulty,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(exercises: Exercise[]): ExerciseResponseDto[] {
    return exercises.map(exercise => this.toResponseDto(exercise));
  }

  static fromCreateDto(dto: CreateExerciseDto): Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name,
      description: dto.description,
      category: dto.category,
      muscleGroups: dto.muscleGroups,
      difficulty: dto.difficulty,
      equipment: dto.equipment,
      instructions: dto.instructions,
    } as Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>;
  }
} 