import { UserExercise, ExerciseSet } from '../../domain/entities/user-exercise';

// DTOs para entrada de datos
export interface CreateUserExerciseDto {
  name: string;
  sets: Omit<ExerciseSet, 'id'>[];
}

export interface UpdateUserExerciseDto {
  name?: string;
  sets?: Omit<ExerciseSet, 'id'>[];
}

export interface ExerciseSetDto {
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  completed?: boolean;
  notes?: string;
}

// DTOs para salida de datos
export interface UserExerciseResponseDto {
  id: string;
  userId: string;
  name: string;
  sets: ExerciseSetResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSetResponseDto {
  id: string;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  completed: boolean;
  notes?: string;
}

export interface UserExerciseListResponseDto {
  exercises: UserExerciseResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserExerciseStatsDto {
  total: number;
  mostUsed: Array<{ name: string; count: number }>;
  totalSets: number;
}

// Mappers
export class UserExerciseMapper {
  static toResponseDto(exercise: UserExercise): UserExerciseResponseDto {
    return {
      id: exercise.id,
      userId: exercise.userId,
      name: exercise.name,
      sets: exercise.sets.map(set => ({
        id: set.id,
        reps: set.reps,
        weight: set.weight,
        duration: set.duration,
        restTime: set.restTime,
        completed: set.completed,
        notes: set.notes
      })),
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(exercises: UserExercise[]): UserExerciseResponseDto[] {
    return exercises.map(exercise => this.toResponseDto(exercise));
  }

  static fromCreateDto(dto: CreateUserExerciseDto): Omit<UserExercise, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: '', // Se asignará en el servicio
      name: dto.name,
      sets: dto.sets.map(set => ({
        id: '', // Se generará automáticamente
        reps: set.reps,
        weight: set.weight,
        duration: set.duration,
        restTime: set.restTime,
        completed: set.completed || false,
        notes: set.notes
      }))
    };
  }
} 