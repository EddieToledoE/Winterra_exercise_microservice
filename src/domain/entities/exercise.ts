export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  equipment?: string[];
  instructions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ExerciseCategory {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  FLEXIBILITY = 'flexibility',
  BALANCE = 'balance',
  SPORTS = 'sports',
  FUNCTIONAL = 'functional'
}

export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  FOREARMS = 'forearms',
  ABS = 'abs',
  GLUTES = 'glutes',
  QUADS = 'quads',
  HAMSTRINGS = 'hamstrings',
  CALVES = 'calves',
  FULL_BODY = 'full_body'
}

export enum ExerciseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
} 