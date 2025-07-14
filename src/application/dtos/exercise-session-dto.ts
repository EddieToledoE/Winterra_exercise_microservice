import { ExerciseSession } from '../../domain/entities/user-exercise';

// DTOs para entrada de datos (lo que envía Flutter)
export interface CreateExerciseSessionDto {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalRestTime: number;
  totalSets: number;
  exercises: SessionExerciseDto[];
  statistics: SessionStatisticsDto;
}

export interface SessionExerciseDto {
  name: string;
  muscleGroup: string;
  sets: SessionSetDto[];
}

export interface SessionSetDto {
  reps: number;
  weight?: number;
  restTime: number;
  completed: boolean;
}

export interface SessionStatisticsDto {
  setsByMuscleGroup: Record<string, number>;
  totalCompletedSets: number;
  totalRestTime: number;
}

// DTOs para salida de datos
export interface ExerciseSessionResponseDto {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalRestTime: number;
  totalSets: number;
  exercises: SessionExerciseResponseDto[];
  statistics: SessionStatisticsDto;
  createdAt: string;
  updatedAt: string;
}

export interface SessionExerciseResponseDto {
  name: string;
  muscleGroup: string;
  sets: SessionSetResponseDto[];
}

export interface SessionSetResponseDto {
  reps: number;
  weight?: number;
  restTime: number;
  completed: boolean;
}

export interface ExerciseSessionListResponseDto {
  sessions: ExerciseSessionResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}

// Mappers
export class ExerciseSessionMapper {
  static toResponseDto(session: ExerciseSession): ExerciseSessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      date: session.date.toISOString(),
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      totalDuration: session.totalDuration,
      totalRestTime: session.totalRestTime,
      totalSets: session.totalSets,
      exercises: session.exercises.map(exercise => ({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
          completed: set.completed
        }))
      })),
      statistics: session.statistics,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  static toResponseDtoList(sessions: ExerciseSession[]): ExerciseSessionResponseDto[] {
    return sessions.map(session => this.toResponseDto(session));
  }

  static fromCreateDto(dto: CreateExerciseSessionDto): Omit<ExerciseSession, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: dto.userId,
      date: new Date(dto.date),
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      totalDuration: dto.totalDuration,
      totalRestTime: dto.totalRestTime,
      totalSets: dto.totalSets,
      exercises: dto.exercises.map((exercise, index) => ({
        id: '', // Se generará automáticamente
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets.map(set => ({
          id: '', // Se generará automáticamente
          reps: set.reps,
          weight: set.weight,
          restTime: set.restTime,
          completed: set.completed
        })),
        order: index + 1
      })),
      statistics: dto.statistics,
      notes: undefined
    };
  }
} 