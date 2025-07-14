import mongoose, { Schema, Document } from 'mongoose';
import { UserExercise, ExerciseSet } from '../../../domain/entities/user-exercise';

export interface UserExerciseDocument extends Omit<UserExercise, 'id'>, Document {}

const ExerciseSetSchema = new Schema<ExerciseSet>({
  reps: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  weight: {
    type: Number,
    min: 0,
    max: 1000
  },
  duration: {
    type: Number,
    min: 0
  },
  restTime: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  _id: true,
  timestamps: false
});

const UserExerciseSchema = new Schema<UserExerciseDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  sets: [ExerciseSetSchema]
}, {
  timestamps: true,
  versionKey: false
});

// Índices para optimizar consultas
UserExerciseSchema.index({ userId: 1, name: 1 });
UserExerciseSchema.index({ userId: 1, createdAt: -1 });

// Métodos estáticos
UserExerciseSchema.statics.findByUserId = function(this: any, userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

UserExerciseSchema.statics.findByUserIdAndName = function(this: any, userId: string, name: string) {
  return this.find({ 
    userId, 
    name: { $regex: name, $options: 'i' } 
  });
};

// Métodos de instancia
UserExerciseSchema.methods.toJSON = function() {
  const exercise = this.toObject();
  delete exercise.__v;
  return exercise;
};

export const UserExerciseModel = mongoose.model<UserExerciseDocument>('UserExercise', UserExerciseSchema); 