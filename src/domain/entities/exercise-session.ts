import { Exercise } from './exercise';

export interface ExerciseSession {
  id: string;
  userId: string;
  name: string;
  exercises: ExerciseEntry[];
  totalDuration: number; // en minutos
  totalSets: number;
  totalRestTime: number; // en segundos
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseEntry {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  order: number;
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

export interface SessionSummary {
  sessionId: string;
  userId: string;
  totalWeight: number;
  totalVolume: number; // peso * repeticiones
  averageRestTime: number;
  sessionDuration: number;
  exercisesCompleted: number;
  setsCompleted: number;
} 