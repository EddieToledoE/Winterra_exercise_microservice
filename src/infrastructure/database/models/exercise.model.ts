import mongoose, { Schema, Document } from 'mongoose';
import { Exercise, ExerciseCategory, MuscleGroup, ExerciseDifficulty } from '../../../domain/entities/exercise';

export interface ExerciseDocument extends Omit<Exercise, "id">, Document {}

const ExerciseSchema = new Schema<ExerciseDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(ExerciseCategory),
    default: ExerciseCategory.STRENGTH
  },
  muscleGroups: [{
    type: String,
    required: true,
    enum: Object.values(MuscleGroup)
  }],
  difficulty: {
    type: String,
    required: true,
    enum: Object.values(ExerciseDifficulty),
    default: ExerciseDifficulty.BEGINNER
  },
  equipment: [{
    type: String,
    trim: true
  }],
  instructions: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Índices para optimizar consultas
ExerciseSchema.index({ name: 'text', description: 'text' });
ExerciseSchema.index({ category: 1 });
ExerciseSchema.index({ muscleGroups: 1 });
ExerciseSchema.index({ difficulty: 1 });
ExerciseSchema.index({ createdAt: -1 });

// Métodos estáticos
ExerciseSchema.statics.findByCategory = function(category: ExerciseCategory) {
  return this.find({ category });
};

ExerciseSchema.statics.findByMuscleGroup = function(muscleGroup: MuscleGroup) {
  return this.find({ muscleGroups: muscleGroup });
};

ExerciseSchema.statics.findByDifficulty = function(difficulty: ExerciseDifficulty) {
  return this.find({ difficulty });
};

ExerciseSchema.statics.searchByText = function(query: string) {
  return this.find({
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

ExerciseSchema.statics.findByFilters = function(filters: {
  category?: ExerciseCategory;
  muscleGroups?: MuscleGroup[];
  difficulty?: ExerciseDifficulty;
  name?: string;
}) {
  const query: any = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.muscleGroups && filters.muscleGroups.length > 0) {
    query.muscleGroups = { $in: filters.muscleGroups };
  }

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }

  return this.find(query);
};

ExerciseSchema.statics.getExerciseStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byCategory: {
          $push: {
            category: '$category',
            count: 1
          }
        },
        byDifficulty: {
          $push: {
            difficulty: '$difficulty',
            count: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        byCategory: {
          $arrayToObject: {
            $map: {
              input: '$byCategory',
              as: 'cat',
              in: {
                k: '$$cat.category',
                v: '$$cat.count'
              }
            }
          }
        },
        byDifficulty: {
          $arrayToObject: {
            $map: {
              input: '$byDifficulty',
              as: 'diff',
              in: {
                k: '$$diff.difficulty',
                v: '$$diff.count'
              }
            }
          }
        }
      }
    }
  ]);

  return stats[0] || { total: 0, byCategory: {}, byDifficulty: {} };
};

// Métodos de instancia
ExerciseSchema.methods.toJSON = function() {
  const exercise = this.toObject();
  delete exercise.__v;
  return exercise;
};

export const ExerciseModel = mongoose.model<ExerciseDocument>('Exercise', ExerciseSchema); 