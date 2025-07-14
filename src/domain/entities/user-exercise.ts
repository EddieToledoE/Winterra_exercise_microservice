export interface UserExercise {
  id: string;
  userId: string;
  name: string;
  sets: ExerciseSet[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight?: number; // en kg
  duration?: number; // en segundos para ejercicios de tiempo
  restTime: number; // en segundos
  completed: boolean;
  notes?: string;
}

// Para sesiones de entrenamiento (actualizada para coincidir con Flutter)
export interface ExerciseSession {
  id: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  totalDuration: number; // en segundos
  totalRestTime: number; // en segundos
  totalSets: number;
  exercises: SessionExercise[];
  statistics: SessionStatistics;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SessionSet[];
  order: number;
}

export interface SessionSet {
  id: string;
  reps: number;
  weight?: number; // en kg
  restTime: number; // en segundos
  completed: boolean;
}

export interface SessionStatistics {
  setsByMuscleGroup: Record<string, number>;
  totalCompletedSets: number;
  totalRestTime: number;
}

// Mantener la interfaz anterior para compatibilidad
export interface ExerciseEntry {
  id: string;
  exercise: UserExercise;
  sets: ExerciseSet[];
  order: number;
} 