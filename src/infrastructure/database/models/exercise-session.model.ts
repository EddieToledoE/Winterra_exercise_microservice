import mongoose, { Schema, Document } from 'mongoose';

// Interfaces para el modelo
interface ISessionSet {
  id: string;
  reps: number;
  weight?: number;
  restTime: number;
  completed: boolean;
}

interface ISessionExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ISessionSet[];
  order: number;
}

interface ISessionStatistics {
  setsByMuscleGroup: Record<string, number>;
  totalCompletedSets: number;
  totalRestTime: number;
}

interface IExerciseSession extends Document {
  userId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  totalRestTime: number;
  totalSets: number;
  exercises: ISessionExercise[];
  statistics: ISessionStatistics;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema para SessionSet
const SessionSetSchema = new Schema<ISessionSet>({
  id: { type: String, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number },
  restTime: { type: Number, required: true },
  completed: { type: Boolean, required: true, default: true }
}, { _id: false });

// Schema para SessionExercise
const SessionExerciseSchema = new Schema<ISessionExercise>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  sets: [SessionSetSchema],
  order: { type: Number, required: true }
}, { _id: false });

// Schema para SessionStatistics
const SessionStatisticsSchema = new Schema<ISessionStatistics>({
  setsByMuscleGroup: { type: Map, of: Number, required: true },
  totalCompletedSets: { type: Number, required: true },
  totalRestTime: { type: Number, required: true }
}, { _id: false });

// Schema principal para ExerciseSession
const ExerciseSessionSchema = new Schema<IExerciseSession>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalDuration: { type: Number, required: true },
  totalRestTime: { type: Number, required: true },
  totalSets: { type: Number, required: true },
  exercises: [SessionExerciseSchema],
  statistics: SessionStatisticsSchema,
  notes: { type: String }
}, {
  timestamps: true,
  collection: 'exercise_sessions'
});

// Índices para optimizar consultas
ExerciseSessionSchema.index({ userId: 1, date: -1 });
ExerciseSessionSchema.index({ userId: 1, startTime: -1 });
ExerciseSessionSchema.index({ userId: 1, createdAt: -1 });

export const ExerciseSessionModel = mongoose.model<IExerciseSession>('ExerciseSession', ExerciseSessionSchema); 